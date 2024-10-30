import { Router } from "express"

import { createFilterObj, createSubCategory, deleteSubCategory, getSubCategories, getSubCategory, setCategoryIdToBody, updateSubCategory } from "./subCategory.controller.js"
import { createSubCategoryValidator, deleteSubCategoryValidator, getSubCategoryValidator, updateSubCategoryValidator } from "./subCategory.validation.js"
import { allowedTo, protect } from "../auth/auth.controller.js"

// mergeParams: Allow us to access parameters on other routers
// ex: We need to access categoryId from category router

export const subCategoryRouter = Router({ mergeParams: true })

subCategoryRouter.route("/").post(protect, allowedTo("admin", "manager"), setCategoryIdToBody, createSubCategoryValidator, createSubCategory).get(createFilterObj, getSubCategories)
subCategoryRouter
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(protect, allowedTo("admin", "manager"), updateSubCategoryValidator, updateSubCategory)
  .delete(protect, allowedTo("admin"), deleteSubCategoryValidator, deleteSubCategory)
