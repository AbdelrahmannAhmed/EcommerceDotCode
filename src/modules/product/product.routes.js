import { Router } from "express"
import { uploadMixOfImages } from "../../middleware/uploadImageMiddleware.js"
import { validate } from "../../middleware/validate.js"
import { allowedTo, protect } from "../auth/auth.controller.js"
import { addProduct, deleteProduct, getProduct, getProducts, resizeImage, updateProduct } from "./product.controller.js"
import { addProductValidation, updateProductValidation } from "./product.validation.js"

export const productRouter = Router()

productRouter
  .route("/")
  .post(
    uploadMixOfImages([
      { name: "image", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    validate(addProductValidation),
    resizeImage,
    protect,
    allowedTo("admin"),
    addProduct
  )
  .get(getProducts)

productRouter.route("/:id").get(getProduct).delete(protect, allowedTo("admin"), deleteProduct)
productRouter.route("/:id").put(
  uploadMixOfImages([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  validate(updateProductValidation),
  protect,
  allowedTo("admin"),
  updateProduct
)
