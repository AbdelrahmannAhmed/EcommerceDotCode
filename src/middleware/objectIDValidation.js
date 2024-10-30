import mongoose from "mongoose";
import { AppError } from "../utlities/appError.js";
export const objectIdValidation = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new AppError("it must be a valid hexadecimal string", 400); // استخدام AppError هنا
    }
    return value;
};