import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utlities/appError.js";
import { messages } from "../../utlities/messages.js";

export const deleteOne = (model) => {

    return catchError(async (req, res, next) => {
        let document = await model.findByIdAndDelete(req.params.id)
        document || next(new AppError(messages.product.notFound, 404));
        !document || res.json({ message: 'Deleted Successfully', data: document });
    })
}