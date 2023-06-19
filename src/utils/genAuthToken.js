const jwt = require('jsonwebtoken');
const generateToken = (res, userId) => {
    const token = jwt.sign({
        userId
    }, process.env.jwt_secret, {
        expiresIn: '1d'
    });
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    })
}


module.exports = generateToken;