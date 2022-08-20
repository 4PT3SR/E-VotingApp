// const mongoose = require('mongoose');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const {commentSchema} = require('../utils/joiValidation');
const AppError = require('../utils/AppError');


exports.comment = async (req,res,next) => {
    try {
        const relatedPost = req.params.id;
        const post = await Post.findOne({_id:relatedPost})

        if(!post) {
            throw new AppError('Oops..Post does not exist',404);
        }

        const payload = await commentSchema.validateAsync(req.body);

        const {body} = payload;
        const comment = await new Comment({body:body,owner:req.user._id,post:relatedPost});

        await comment.save();

        post.comments.push(comment._id);

        await post.save()

        res.status(200).json({status:'Success',data:comment})
    } catch (error) {
        next(error)
    }
}

exports.deleteComment = async (req,res,next) => {
    try {
        const commentId = req.params.id;
        // const post = await Post.findById();
        // const comment = await Comment.deleteOne({_id:commentId});
        const comment = await Comment.findById(commentId);
        if(!comment) {
            throw new AppError('Oops..Comment does not exist');
        }
        const post = await Post.findById(comment.post._id);

        await comment.remove();
        

   post.comments = post.comments.filter(comment =>{
        return comment != commentId;
        
    });
    await post.save()

        res.status(200).json({status:'Success',message:'Comment deleted'});

    } catch (error) {
        next(error);
        
    }
}