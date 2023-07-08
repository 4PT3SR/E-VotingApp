const Data = require('../models/dataModel');
const AppError = require('../utils/AppError');
const {
    dataSchema
} = require('../utils/joiValidation')


exports.getData = async (req, res, next) => {
    try {
        const dataTitle = req.params.dataTitle;

        const data = await Data.find({
            title: {
                $regex: dataTitle,
                $options: "i"
            }
        })

        if (data.length === 0) {
            throw new AppError('Data does not exist', 400);
        }

        res.status(200).json({
            status: 'success',
            data
        });
    } catch (error) {
        next(error)
    }
}

exports.createData = async (req, res, next) => {
    try {
        const body = await dataSchema.validateAsync(req.body);
        await Data.create(body);

        res.status(200).json({
            status: 'success'
        });
    } catch (error) {
        next(error)
    }
}