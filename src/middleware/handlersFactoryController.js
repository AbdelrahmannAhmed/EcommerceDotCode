import asyncHandler from "express-async-handler"
import { apiFeatures } from "../utlities/apifeatures.js"
import { AppError } from "../utlities/appError.js"
import { messages } from "../utlities/messages.js"
import slugify from "slugify"

export function deleteOne(Model) {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const document = await Model.findByIdAndDelete(id)

    if (!document) {
      return next(new AppError(`No document for this id ${id}`, 404))
    }
    res.status(202).json({ message: `Document ${document.name} deleted successfully` })
  })
}

export function updateOne(Model) {
  return asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    if (!document) {
      return next(new AppError(`No document for this id ${req.params.id}`, 404))
    }
    res.status(200).json({ data: document })
  })
}

export function createOne(Model) {
  return asyncHandler(async (req, res) => {
    req.body.slug = slugify(req.body.name)
    const newDoc = await Model.create(req.body)
    res.status(201).json({ data: newDoc })
  })
}

export function getOne(Model) {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const document = await Model.findById(id)
    if (!document) {
      return next(new AppError(`No document for this id ${id}`, 404))
    }
    res.status(200).json({ data: document })
  })
}

export function getAll(Model, modelName = "", populateOptions = "") {
  return asyncHandler(async (req, res) => {
    let filter = {}
    if (req.filterObj) {
      filter = req.filterObj
    }

    let features = new apiFeatures(Model.find(filter), req.query).filter().search().sort().fields()
    if (populateOptions) {
      features.mongooseQuery = features.mongooseQuery.populate(populateOptions)
    }
    const totalDocuments = await Model.countDocuments(features.mongooseQuery.getFilter())
    const documents = await features.pagination()

    res.status(200).json({
      message: messages.subCategory.successGet,
      totalDocuments: totalDocuments,
      pageNumber: features.pageNumber,
      limit: features.limit,
      data: documents,
    })
  })
}
