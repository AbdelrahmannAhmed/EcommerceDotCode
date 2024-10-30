import { v2 as cloudinary } from "cloudinary"
import expressAsyncHandler from "express-async-handler"
import slugify from "slugify"
import { Product } from "../../../database/models/product.model.js"
import { catchError } from "../../middleware/catchError.js"
import { uploadMixOfImages, uploadSingleImage } from "../../middleware/uploadImageMiddleware.js"
import { apiFeatures } from "../../utlities/apifeatures.js"
import { AppError } from "../../utlities/appError.js"
import { messages } from "../../utlities/messages.js"
import { deleteOne } from "../handlers/handlers.js"

export const resizeImage = expressAsyncHandler(async (req, res, next) => {
  // console.log("Received file:", req.file)
  // console.log("Received files:", req.files)
  try {
    // Initialize Cloudinary configuration
    cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.api_secret,
    })

    // Handle single file upload
    if (req.files.image[0]) {
      req.file = req.files.image[0]
      const format = req.file.mimetype.split("/")[1]
      const fileBuffer = req.file.buffer
      const base64str = `data:${req.file.mimetype};base64,${fileBuffer.toString("base64")}`

      const result = await cloudinary.uploader.upload(base64str, {
        folder: "product",
        format: format,
      })

      req.body.image = result.secure_url // Save the URL for the main image
      console.log("Main image URL:", req.body.image)
    }

    // Handle multiple file uploads
    if (req.files && req.files.images) {
      req.body.images = [] // Initialize an array to hold the image URLs
      const uploadPromises = req.files.images.map(async (file) => {
        const format = file.mimetype.split("/")[1]
        const fileBuffer = file.buffer
        const base64str = `data:${file.mimetype};base64,${fileBuffer.toString("base64")}`

        const result = await cloudinary.uploader.upload(base64str, {
          folder: "product",
          format: format,
        })

        req.body.images.push(result.secure_url) // Push each image URL to the array
      })

      await Promise.all(uploadPromises) // Wait for all uploads to complete
    }

    next()
  } catch (error) {
    // console.error("Error uploading image:", error)
    next(error)
  }
})

const addProduct = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name)

  // req.body.image = req.files.image[0].filename
  // if (req.body.images) req.body.images = req.files.images.map((img) => img.filename)

  let product = new Product(req.body)
  await product.save()
  res.status(201).json({ message: messages.product.addedSuccessfully, product })
})

const getProducts = catchError(async (req, res, next) => {
  let features = new apiFeatures(Product.find(), req.query).fields().filter().sort().search()
  const totalDocuments = await Product.countDocuments(features.mongooseQuery.getFilter())
  let products = await features.pagination()
  products || next(new AppError(messages.product.notFound, 404))
  !products ||
    res.json({
      totalDocuments: totalDocuments,
      message: messages.product.successGet,
      pageNumber: features.pageNumber,
      limit: features.limit,
      data: products,
    })
})

const getProduct = catchError(async (req, res, next) => {
  let product = await Product.findById(req.params.id)
  product || next(new AppError(messages.product.notFound, 404))
  !product || res.json({ message: messages.product.successGet, data: product })
})

const deleteProduct = deleteOne(Product)

const updateProduct = catchError(async (req, res, next) => {
  req.body.name ? (req.body.slug = slugify(req.body.name)) : ""

  if (req.files) {
    if (req.files.image && req.files.image.length) {
      req.body.image = req.files.image[0].filename
    }
    if (req.files.images && req.files.images.length) {
      req.body.images = req.files.images.map((img) => img.filename)
    }
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
  if (!product) {
    return next(new AppError(messages.product.notFound, 404))
  }
  res.json({
    message: messages.product.updatedSuccessfully,
    data: product,
  })
})

export { addProduct, deleteProduct, getProduct, getProducts, updateProduct }
