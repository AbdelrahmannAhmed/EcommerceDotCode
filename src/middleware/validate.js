import { AppError } from "../utlities/appError.js"

export const validate = (schema) => {
  return (req, res, next) => {
    // تحويل الحقول التي يجب أن تكون مصفوفات في حال كانت واردة كنص
    if (req.body.size && typeof req.body.size === "string") {
      req.body.size = req.body.size.split(",").map((item) => item.trim())
    }

    if (req.body.colors && typeof req.body.colors === "string") {
      req.body.colors = req.body.colors.split(",").map((item) => item.trim())
    }

    // تجهيز الكائن للتحقق
    const validationObject = {
      ...req.body,
      ...req.params,
      ...req.query,
      image: req.file,
    }

    // التحقق من البيانات باستخدام Joi
    const { error } = schema.validate(validationObject, {
      abortEarly: false,
    })

    if (!error) {
      next()
    } else {
      let errorMsg = error.details.map((err) => err.message)
      next(new AppError(errorMsg, 401))
    }
  }
}
