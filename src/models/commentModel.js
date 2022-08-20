const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const AppError = require('../utils/AppError')

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required:true
    },
    owner: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
},{timestamps:true});



const Comment = new mongoose.model('comment',commentSchema);


module.exports = Comment;
