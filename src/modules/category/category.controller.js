import { v2 as cloudinary } from "cloudinary"
import asyncHandler from "express-async-handler"
import { Category } from "../../../database/models/category.model.js"
import { createOne, deleteOne, getAll, getOne, updateOne } from "../../middleware/handlersFactoryController.js"
import { uploadSingleImage } from "../../middleware/uploadImageMiddleware.js"

export const uploadCategoryImage = uploadSingleImage("image")

export const resizeImage = asyncHandler(async (req, res, next) => {
  try {
    // Initialize Cloudinary configuration
    cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.api_secret,
    })

    if (req.file) {
      const format = req.file.mimetype.split("/")[1] // jpg or png
      const fileBuffer = req.file.buffer
      const base64str = `data:${req.file.mimetype};base64,${fileBuffer.toString("base64")}`

      const result = await cloudinary.uploader.upload(base64str, {
        folder: "category",
        format: format, // use dynamic format
        // يمكن حذف هذه الخاصية للاختبار
        // quality: "auto:best",
      })

      // Save image URL into our db
      req.body.image = result.secure_url
    }

    next()
  } catch (error) {
    console.error("Error uploading image:", error) // Print error
    next(error)
  }
})

export const getCategories = getAll(Category)

export const getCategory = getOne(Category)

export const createCategory = createOne(Category)

export const updateCategory = updateOne(Category)

export const deleteCategory = deleteOne(Category)
