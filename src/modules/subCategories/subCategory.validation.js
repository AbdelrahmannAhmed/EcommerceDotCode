import slugify from "slugify"
import { check, body } from "express-validator"
import validatorMiddleware from "../../middleware/validatorMiddleware.js"

export const getSubCategoryValidator = [check("id").isMongoId().withMessage("Invalid Subcategory id format"), validatorMiddleware]

export const createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory required")
    .isLength({ min: 2 })
    .withMessage("Too short Subcategory name")
    .isLength({ max: 32 })
    .withMessage("Too long Subcategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val)
      return true
    }),
  check("category").notEmpty().withMessage("subCategory must be belong to category").isMongoId().withMessage("Invalid Category id format"),
  validatorMiddleware,
]

export const updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val)
    return true
  }),
  validatorMiddleware,
]

export const deleteSubCategoryValidator = [check("id").isMongoId().withMessage("Invalid SubCategory id format"), validatorMiddleware]
