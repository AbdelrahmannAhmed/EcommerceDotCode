import multer from "multer"
import { v4 as uuidv4 } from "uuid"
import { AppError } from "../utlities/appError.js"

const fileUpload = (folderName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${folderName}`)
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() + "-" + file.originalname)
    },
  })

  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true)
    } else {
      cb(new AppError("Only images are allowed", 401), false)
    }
  }

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 10 },
  })
  return upload
}

export const uplaodSingleFile = (fieldName, folderName) => {
  return fileUpload(folderName).single(fieldName)
}

export const uplaodMixOfFiles = (arrayOfFields, folderName) => {
  return fileUpload(folderName).fields(arrayOfFields)
}
