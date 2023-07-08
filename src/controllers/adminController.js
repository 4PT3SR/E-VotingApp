const User = require('../models/userModel');
const AppError = require('../utils/AppError');
exports.getUsers = async (req, res, next) => {
    try {
        const search = req.query.search || 'all'
        let query;
        if (search === 'all') {
            query = User.find({})
        } else {
            query = User.find({
                matric_number: {
                    $regex: search,
                    $options: "i"
                }
            })
        }

        const page = req.query.page * 1 || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numElections = await User.countDocuments();
            if (skip >= numElections) throw new AppError('This page does not exist', 404);
        }

        let users = await query;


        res.status(200).json({
            status: 'success',
            data: users
        })
    } catch (error) {
        next(error)
    }
}

exports.makeAdmin = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) throw new AppError('No user found', 400)
        if (user.isAdmin === true) throw new AppError('User is already an admin', 400)

        user.role = 'ADMIN'

        user.save();
        res.status(200).json({
            status: 'success'
        })
    } catch (error) {
        next(error)
    }
}

exports.removeAdmin = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) throw new AppError('No user found', 400)
        if (user.isAdmin === false) throw new AppError('User not an admin', 400)

        user.role = 'USER'

        user.save();
        res.status(200).json({
            status: 'success'
        })
    } catch (error) {
        next(error)
    }
}