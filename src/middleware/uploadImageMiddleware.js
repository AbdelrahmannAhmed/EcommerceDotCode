import multer, { memoryStorage } from "multer"
import { AppError } from "../utlities/appError.js"

const multerOptions = () => {
  const multerStorage = memoryStorage()

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true)
    } else {
      cb(new AppError("Only Images allowed", 400), false)
    }
  }

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

  return upload
}

export function uploadSingleImage(fieldName) {
  return multerOptions().single(fieldName)
}

export function uploadMixOfImages(arrayOfFields) {
  return multerOptions().fields(arrayOfFields)
}
