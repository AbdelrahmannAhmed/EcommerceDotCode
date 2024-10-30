import Joi from "joi"
import { objectIdValidation } from "../../middleware/objectIDValidation.js"

const imageSchema = Joi.object({
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  encoding: Joi.string().required(),
  mimetype: Joi.string().valid("image/jpeg", "image/png", "image/gif", "image/jpg").required(),
  size: Joi.number().max(5242880).required(),
  buffer: Joi.binary().required(),
})

// Validation for adding a product
const addProductValidation = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  Desc: Joi.string().min(10).max(2000).required(),
  image: imageSchema.optional(),
  images: Joi.array().items(imageSchema).optional(),
  price: Joi.number().min(0).required(),
  priceAfterDiscount: Joi.number().min(0),
  soldItems: Joi.number().min(0),
  stock: Joi.number().min(0),
  category: Joi.string().custom(objectIdValidation),
  SubCategory: Joi.string().custom(objectIdValidation),
  Brand: Joi.string().custom(objectIdValidation),
  rateavg: Joi.number().min(0).max(5),
  rateCount: Joi.number().min(0),
  createdby: Joi.string().custom(objectIdValidation),
  size: Joi.array().items(Joi.string().valid("XS", "S", "M", "L", "XL")).optional(), // إضافة التحقق لحقل الحجم
  colors: Joi.array().items(Joi.string()).optional(), // إضافة التحقق لحقل الألوان
})

// Validation for updating a product
const updateProductValidation = Joi.object({
  title: Joi.string().min(3).max(50).optional(),
  Desc: Joi.string().min(10).max(2000).optional(),
  image: imageSchema.optional(),
  images: Joi.array().items(imageSchema).optional(),
  price: Joi.number().min(0).optional(),
  priceAfterDiscount: Joi.number().min(0),
  soldItems: Joi.number().min(0),
  stock: Joi.number().min(0),
  category: Joi.string().custom(objectIdValidation),
  SubCategory: Joi.string().custom(objectIdValidation),
  Brand: Joi.string().custom(objectIdValidation),
  rateavg: Joi.number().min(0).max(5),
  rateCount: Joi.number().min(0),
  createdby: Joi.string().custom(objectIdValidation),
  id: Joi.string().custom(objectIdValidation).optional(),
  size: Joi.array().items(Joi.string().valid("XS", "S", "M", "L", "XL")).optional(), // إضافة التحقق لحقل الحجم
  colors: Joi.array().items(Joi.string()).optional(), // إضافة التحقق لحقل الألوان
})

export { addProductValidation, updateProductValidation }
