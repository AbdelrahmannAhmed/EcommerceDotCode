import { Router } from "express"

import { changeUserPasswordValidator, createUserValidator, deleteUserValidator, getUserValidator, updateLoggedUserValidator, updateUserValidator } from "./user.validation.js"
import { protect } from "../auth/auth.controller.js"
import {
  changeUserPassword,
  createUser,
  deleteLoggedUserData,
  deleteUser,
  getLoggedUserData,
  getUser,
  getUsers,
  resizeImage,
  updateLoggedUserData,
  updateLoggedUserPassword,
  updateUser,
  uploadUserImage,
} from "./user.contoller.js"
import { orderRouter } from "../order/order.routes.js"

export const userRouter = Router()

userRouter.use(protect)

userRouter.get("/getMe", getLoggedUserData, getUser)
userRouter.put("/changeMyPassword", updateLoggedUserPassword)
userRouter.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData)
userRouter.delete("/deleteMe", deleteLoggedUserData)
userRouter.use("/:userid/order", orderRouter)

// Admin
//userRouter.use(authController.allowedTo('admin', 'manager'));
userRouter.put("/changePassword/:id", changeUserPasswordValidator, changeUserPassword)
userRouter.route("/").get(getUsers).post(uploadUserImage, resizeImage, createUserValidator, createUser)
userRouter.route("/:id").get(getUserValidator, getUser).put(uploadUserImage, resizeImage, updateUserValidator, updateUser).delete(deleteUserValidator, deleteUser)
