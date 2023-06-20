const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
const AppError = require('../utils/AppError')

const candidateSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    cloudinary_id: {
        type: String
    },
    votes: {
        type: Number,
        default: 0
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }

}, {
    timestamps: true
});



const Candidate = new mongoose.model('candidate', candidateSchema);


module.exports = Candidate;