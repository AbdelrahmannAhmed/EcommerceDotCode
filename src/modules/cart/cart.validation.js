import Joi from "joi"
import { objectIdValidation } from "../../middleware/objectIDValidation.js";


const addBrandValidation = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif', 'image/jpg').required(),
        size: Joi.number().max(5242880).required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
    }).required(),
    createdby: Joi.string().custom(objectIdValidation)
});


const updateBrandValidation = Joi.object({
    name: Joi.string().min(1).max(50),
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif', 'image/jpg').required(),
        size: Joi.number().max(5242880).required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
    }).optional(),
    createdby: Joi.string().custom(objectIdValidation).optional(),
    id: Joi.string().custom(objectIdValidation).optional()
})


export {
    addBrandValidation,
    updateBrandValidation
}