import { Router } from "express"
import { createCategoryValidator, deleteCategoryValidator, getCategoryValidator, updateCategoryValidator } from "./category.validation.js"
import { createCategory, deleteCategory, getCategories, getCategory, resizeImage, updateCategory, uploadCategoryImage } from "./category.controller.js"
import { allowedTo, protect } from "../auth/auth.controller.js"
import { subCategoryRouter } from "../subCategories/subCategory.routes.js"

export const categoryRouter = Router()
categoryRouter.use("/:categoryId/subcategories", subCategoryRouter)
categoryRouter.route("/").post(protect, allowedTo("admin", "manager"), uploadCategoryImage, resizeImage, createCategoryValidator, createCategory).get(getCategories)
categoryRouter
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(protect, allowedTo("admin", "manager"), uploadCategoryImage, resizeImage, updateCategoryValidator, updateCategory)
  .delete(protect, allowedTo("admin"), deleteCategoryValidator, deleteCategory)
