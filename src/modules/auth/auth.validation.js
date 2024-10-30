import slugify from "slugify"
import { check } from "express-validator"
import validatorMiddleware from "../../middleware/validatorMiddleware.js"
import { User } from "../../../database/models/user.model.js"

export const signupValidator = [
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
        // استخدام User هنا
        if (user) {
          return Promise.reject(new Error("E-mail already in use")) // تصحيح الرسالة
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

  validatorMiddleware,
]

export const loginValidator = [
  check("email").notEmpty().withMessage("Email required").isEmail().withMessage("Invalid email address"),

  check("password").notEmpty().withMessage("Password required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  validatorMiddleware,
]
