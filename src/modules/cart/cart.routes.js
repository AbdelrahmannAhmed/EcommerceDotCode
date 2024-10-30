import { Router } from "express"
import { allowedTo, protect } from "../auth/auth.controller.js"
import { addCart, clearUserCart, getLoggedUserCart, removeItemfromCart, updateQuantity } from "./cart.contoller.js"

export const cartRouter = Router()

cartRouter.route("/").post(protect, allowedTo("user", "admin"), addCart).get(protect, allowedTo("user", "admin"), getLoggedUserCart).delete(protect, allowedTo("user", "admin"), clearUserCart)

cartRouter.route("/:id").put(protect, allowedTo("user", "admin"), updateQuantity).get().delete(protect, allowedTo("user", "admin"), removeItemfromCart)
// cartRouter.route("/apply-coupon").post(protect, allowedTo("user", "admin"), applyCoupon)
