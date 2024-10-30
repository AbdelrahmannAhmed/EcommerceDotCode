import { SubCategory } from "../../../database/models/subcategory.model.js"
import { getAll, getOne, createOne, updateOne, deleteOne } from "../../middleware/handlersFactoryController.js"

export function setCategoryIdToBody(req, res, next) {
  // Nested route (Create)
  if (!req.body.category) req.body.category = req.params.categoryId
  next()
}

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
export function createFilterObj(req, res, next) {
  let filterObject = {}
  if (req.params.categoryId) filterObject = { category: req.params.categoryId }
  req.filterObj = filterObject
  next()
}

export const getSubCategories = getAll(SubCategory, "SubCategory", { path: "category", select: "name" })

export const getSubCategory = getOne(SubCategory)

export const createSubCategory = createOne(SubCategory)

export const updateSubCategory = updateOne(SubCategory)

export const deleteSubCategory = deleteOne(SubCategory)
