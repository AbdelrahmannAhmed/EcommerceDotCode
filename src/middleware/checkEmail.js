import { User } from "../../database/models/user.model.js"
import { AppError } from "../utlities/appError.js"

export const checkEmail = async (req, res, next) => {
    let isExist = await User.findOne({ email: req.body.email })
    if (isExist) next(new AppError('Email already exist', 409))
    next()
}