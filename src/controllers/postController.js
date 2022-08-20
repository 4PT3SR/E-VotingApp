const fs = require('fs');
const path = require('path');
const Post = require('../models/postModel');
const {postSchema} = require('../utils/joiValidation');
const AppError = require('../utils/AppError');
const cloudinary = require('../utils/cloudinary');


exports.post = async (req,res,next) => {
    try {
        const payload = await postSchema.validateAsync(req.body);
        const {body,title} = payload;
        const post = await new Post({title,body,author:req.user._id});
        
        // console.log(req.file.path);
        if(req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
           post.attachment = result.secure_url;
            post.cloudinary_id = result.public_id;
        }
        

        await post.save();

        res.status(201).json({message: 'Success',data:post});
    } catch (error) {
        next(error);
    }
}


exports.getAllPosts = async (req,res,next) => {
    try {
        let query = Post.find({});
        // console.log(req.query.page);
        const page = req.query.page * 1 || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if(req.query.page) {
            const numPosts = await Post.countDocuments();
            if(skip >= numPosts) throw new AppError('This page does not exist',404);
        }
        let posts = await query.populate([{
            path:'author',
            select:'username'
        },{
            path:'comments',
            select:'body -_id'
        }]);

        res.status(200).json({message:'Success',data:posts});
    } catch (error) {
        next(error)
    }
}



// const Dummyposts = fs.readFileSync(path.resolve(__dirname, '../helpers/seed.json'), {
//   encoding: "utf-8",
// });

// exports.dummyPosts = async (req,res,next) => {
//     const user = req.user;
//     try {
        
//         const userDummyPost = JSON.parse(Dummyposts);
//         userDummyPost.forEach(post => {
//             post.author = user._id;
//         });
//         await Post.insertMany(userDummyPost);
//         console.log(userDummyPost);
//         res.send('ok')
//     } catch (error) {
//         next(error)
//     }
// }
