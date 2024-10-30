import pkg from "bcryptjs"
import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import sharp from "sharp"
import { v4 as uuidv4 } from "uuid"
import { User } from "../../../database/models/user.model.js"
import { createOne, deleteOne, getAll, getOne } from "../../middleware/handlersFactoryController.js"
import { uploadSingleImage } from "../../middleware/uploadImageMiddleware.js"
import { AppError } from "../../utlities/appError.js"
const { hash } = pkg

export const uploadUserImage = uploadSingleImage("profileImg")

export const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`

  if (req.file) {
    await sharp(req.file.buffer).resize(600, 600).toFormat("jpeg").jpeg({ quality: 95 }).toFile(`uploads/users/${filename}`)

    // Save image into our db
    req.body.profileImg = filename
  }

  next()
})

export const getUsers = getAll(User)
export const getUser = getOne(User)
export const createUser = createOne(User)

export const updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  )

  if (!document) {
    return next(new AppError(`No document for this id ${req.params.id}`, 404))
  }
  res.status(200).json({ data: document })
})

export const changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  )

  if (!document) {
    return next(new AppError(`No document for this id ${req.params.id}`, 404))
  }
  res.status(200).json({ data: document })
})

export const deleteUser = deleteOne(User)

export const getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id
  next()
})

export const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // Update user password based on user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  )

  // Generate token

  let token = `Bearer ${jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY)}`

  res.status(200).json({ message: "Password changed successfully", name: user.name, email: user.email, token })
})

export const updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  )
  let token = `Bearer ${jwt.sign({ userId: updatedUser._id, role: updatedUser.role }, process.env.JWT_KEY)}`

  res.status(200).json({ name: updatedUser.name, email: updatedUser.email, role: updatedUser.role, token })
})

export const deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id, { active: false })

  res.status(203).json({ message: `User ${req.user.name} is deleted successfully` })
})
