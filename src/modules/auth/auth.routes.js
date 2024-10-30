import { Router } from "express"

// import { forgotPassword, login, resetPassword, signup, verifyPassResetCode } from "./auth.controller"
import { loginValidator, signupValidator } from "./auth.validation.js"
import { forgotPassword, login, resetPassword, signup, verifyPassResetCode } from "./auth.controller.js"

export const authRouter = Router()

authRouter.post("/signup", signupValidator, signup)
authRouter.post("/login", loginValidator, login)
authRouter.post("/forgotPassword", forgotPassword)
authRouter.post("/verifyResetCode", verifyPassResetCode)
authRouter.put("/resetPassword", resetPassword)

export default authRouter
