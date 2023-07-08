const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')


const auth = async (req, res, next) => {
    try {
        let authToken = req.header('Authorization');
        if (!authToken) {
            throw new AppError('No auth token', 401);
        }
        authToken = authToken.replace('Bearer ', '')

        let payload = jwt.verify(authToken, process.env.jwt_secret);

        let user = await User.findById(payload.userId);

        if (!user) {
            throw new AppError('Unable to authenticate user', 401);
        }

        req.user = user;
        // req.authToken = authToken;
        next()

    } catch (error) {
        next(error)
    }

}


// const auth = async (req, res, next) => {
//     try {
//         let token = req.cookies.jwt;

//         if (!token) {
//             throw new AppError('Not authorized, no token', 401)

//         }
//         token = req.cookies.jwt;
//         const decoded = jwt.verify(token, process.env.jwt_secret);
//         const user = await User.findById(decoded.userId);
//         if (!user) {
//             throw new AppError('Unable to authenticate user', 401);
//         }
//         req.user = user;
//         next();
//     } catch (error) {
//         next(error)
//     }
// }

module.exports = auth