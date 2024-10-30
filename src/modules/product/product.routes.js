import { Router } from "express"
import { uplaodMixOfFiles } from "../../fileUpload/fileUpload.js"
import { uploadMixOfImages } from "../../middleware/uploadImageMiddleware.js"
import { validate } from "../../middleware/validate.js"
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
    addProduct
  )
  .get(getProducts)

productRouter.route("/:id").get(getProduct).delete(deleteProduct)
productRouter.route("/:id").put(
  uploadMixOfImages([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  validate(updateProductValidation),
  updateProduct
)
