import pkg from "bcryptjs"
import asyncHandler from "express-async-handler"
import { User } from "../../../database/models/user.model.js"
import createToken from "../../utlities/createToken.js"
import sendEmail from "../../utlities/sendEmail.js"
import { AppError } from "../../utlities/appError.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto" // تم إضافة الاستيراد هنا
import nodemailer from "nodemailer"

const { compare } = pkg

// Signup
export const signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  })

  let token = `Bearer ${jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY)}`
  res.status(201).json({ name: user.name, email: user.email, token })
})

// Login
export const login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
    return next(new AppError("Incorrect email or password", 401))
  }

  let token = `Bearer ${jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY)}`
  delete user._doc.password

  res.status(200).json({ name: user.name, email: user.email, role: user.role, token })
})

// Protect route middleware
export const protect = asyncHandler(async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }
  if (!token) {
    return next(new AppError("You are not logged in, Please log in to access this route", 401))
  }

  let userPayload = null
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) return next(new AppError(err, 401))
    userPayload = payload
  })

  const currentUser = await User.findById(userPayload.userId)
  if (!currentUser) {
    return next(new AppError("The user that belongs to this token does no longer exist", 401))
  }

  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10)
    if (passChangedTimestamp > userPayload.iat) {
      return next(new AppError("User recently changed their password. Please log in again.", 401))
    }
  }

  req.user = currentUser
  next()
})

// Authorization (User Permissions)
export const allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You are not allowed to access this route", 403))
    }
    next()
  })

// Forgot password
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError(`There is no user with that email ${req.body.email}`, 404))
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
  const hashedResetCode = crypto.createHash("sha256").update(resetCode).digest("hex")

  user.passwordResetCode = hashedResetCode
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000
  user.passwordResetVerified = false

  await user.save()

  const message = `Hi ${user.name},\n We received a request to reset the password on your .code E-Commerce Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The .code E-commerce Team`

  try {
    const sendEmail = async () => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      })
      const info = transporter.sendMail({
        from: '".code"<abdelrhmanahmed23i8@gmail.com> ',
        to: user.email,
        subject: "Your password reset code (valid for 10 min)",
        html: `<h1>${message}</h1>`,
      })
      console.log("Message sent :%s", info.messageId)
    }
    sendEmail()
  } catch (err) {
    user.passwordResetCode = undefined
    user.passwordResetExpires = undefined
    user.passwordResetVerified = undefined
    await user.save()
    return next(new AppError("There is an error in sending email", 500))
  }

  res.status(200).json({ status: "Success", message: "Reset code sent to email" })
})

// Verify password reset code
export const verifyPassResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto.createHash("sha256").update(req.body.resetCode).digest("hex")

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  })
  if (!user) {
    return next(new AppError("Reset code invalid or expired"))
  }

  user.passwordResetVerified = true
  await user.save()

  res.status(200).json({ status: "Reset code verified successfully" })
})

// Reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError(`There is no user with email ${req.body.email}`, 404))
  }

  if (!user.passwordResetVerified) {
    return next(new AppError("Reset code not verified", 400))
  }

  user.password = req.body.newPassword
  user.passwordResetCode = undefined
  user.passwordResetExpires = undefined
  user.passwordResetVerified = undefined

  await user.save()
  let token = `Bearer ${jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY)}`

  res.status(200).json({ message: "Password changed successfully", token })
})
