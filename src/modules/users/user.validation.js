import slugify from "slugify"
import bcrypt from "bcryptjs"
import { check, body } from "express-validator"
import { User } from "../../../database/models/user.model.js"
import validatorMiddleware from "../../middleware/validatorMiddleware.js"

export const createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val)
      return true
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"))
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect")
      }
      return true
    }),

  check("passwordConfirm").notEmpty().withMessage("Password confirmation required"),

  check("phone").optional().isMobilePhone(["ar-EG", "ar-SA"]).withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  check("profileImg").optional(),
  check("role").optional(),

  validatorMiddleware,
]

export const getUserValidator = [check("id").isMongoId().withMessage("Invalid User id format"), validatorMiddleware]

export const updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val)
      return true
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"))
        }
      })
    ),
  check("phone").optional().isMobilePhone(["ar-EG", "ar-SA"]).withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
]

export const changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("currentPassword").notEmpty().withMessage("You must enter your current password"),
  body("passwordConfirm").notEmpty().withMessage("You must enter the password confirm"),
  body("password")
    .notEmpty()
    .withMessage("You must enter new password")
    .custom(async (val, { req }) => {
      // Verify current password
      const user = await User.findById(req.params.id)
      if (!user) {
        throw new Error("There is no user for this id")
      }
      const isCorrectPassword = await bcrypt.compare(req.body.currentPassword, user.password)
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password")
      }

      // Verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect")
      }
      return true
    }),
  validatorMiddleware,
]

export const deleteUserValidator = [check("id").isMongoId().withMessage("Invalid User id format"), validatorMiddleware]

export const updateLoggedUserValidator = [
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val)
      return true
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"))
        }
      })
    ),
  check("phone").optional().isMobilePhone(["ar-EG", "ar-SA"]).withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  validatorMiddleware,
]
