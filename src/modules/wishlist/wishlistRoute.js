import { Router } from "express"

import * as authService from "../auth/auth.controller.js"
import { addProductToWishlist, getLoggedUserWishlist, removeProductFromWishlist } from "./wishlistController.js"

export const wishlistRouter = Router()

wishlistRouter.use(authService.protect, authService.allowedTo("user", "admin"))

wishlistRouter.route("/").post(addProductToWishlist).get(getLoggedUserWishlist)

wishlistRouter.delete("/:productId", removeProductFromWishlist)
