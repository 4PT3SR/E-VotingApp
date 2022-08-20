const AppError = require('../utils/AppError')

const handleJoiValidation = (error) => {
    return new AppError(`${error.message}`,400);
}
const handleDuplicateKey = (error) => {
    let duplicateKey = Object.keys(error.keyValue);
    duplicateKey = duplicateKey[0];
    const message = `${duplicateKey} is already ${duplicateKey === 'username'? 'taken':'registered'}`;
    return new AppError(message,400);
}

const handleInvalidId = (error) => {
    const message= `Invalid ${error.path}:${error.value}`

    return new AppError(message,400);
}
const sendProdError = (err,res) => {
    if(err.isOperational) {
        res.status(err.statusCode).json({status:err.status,message:err.message});
    } else {
        res.status(500).json({status:'Error',message:"Something went wrong,it's not yout fault...Try again later."})
    }
}

const sendDevError = (err,res) => {
    res.status(err.statusCode || 500).json({message:err.message,stack:err.stack,err});
}

module.exports = function (err,req,res,next) {
    let error = {...err,message:err.message}
    if(process.env.NODE_ENV === 'production') {
        if(error.details) error = handleJoiValidation(error);
        if(error.code === 11000) error = handleDuplicateKey(error);
        if(error.kind === 'ObjectId') error = handleInvalidId(error)
        sendProdError(error,res);
    } else if(process.env.NODE_ENV === 'development') {
        sendDevError(error,res);
    }
}