const mongoose = require('mongoose');
const AppError = require('../utils/AppError')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    candidates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'candidate'
    }],
    election: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'election',
        required: true
    }

}, {
    timestamps: true
});



const Post = new mongoose.model('post', postSchema);


module.exports = Post;