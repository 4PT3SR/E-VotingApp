const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
const AppError = require('../utils/AppError')

const postSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true,
    }, body: {
        type:String,
        required: true,
    },attachment: {
        type: String
    },
    cloudinary_id:{
        type:String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },comments:[{
        type: mongoose.Schema.Types.ObjectId,ref:'comment'
    }]

},{timestamps:true});



const Post = new mongoose.model('post',postSchema);


module.exports = Post;
