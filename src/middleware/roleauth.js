const AppError = require('../utils/AppError')


exports.isAdmin = async (req,res,next) => {
    try {
        const user = req.user;
        if(user.isAdmin) return next()

        throw new AppError('You are Unauthorized',403)
        
    } catch (error) {
        next(error);
    }
}