import { Router } from "express"
import { allowedTo, protect } from "../auth/auth.controller.js"
import { createCashOrder, createCheckoutSession, getAllOrders, getUserOrder } from "./order.contoller.js"

export const orderRouter = Router({ mergeParams: true })

orderRouter.route("/:id").post(protect, allowedTo("user", "admin"), createCashOrder)

orderRouter.route("/").get(protect, allowedTo("user", "admin"), getUserOrder)
orderRouter.route("/all").get(protect, allowedTo("admin"), getAllOrders)
orderRouter.route("/checkout/:id").post(protect, allowedTo("user", "admin"), createCheckoutSession)
