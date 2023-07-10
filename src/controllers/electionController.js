const {
    electionSchema,
    postSchema,
    candidateSchema
} = require('../utils/joiValidation');
const {
    checkIfCanAddCandidate,
    checkIfCanAddPost
} = require('../utils/editElection')
// const User = require('../models/userModel')
const Post = require('../models/postModel')
const Candidate = require('../models/candidateModel');
const Election = require('../models/electionModel');
const AppError = require('../utils/AppError');
const cloudinary = require('../utils/cloudinary');
// const crypto = require('crypto');

// @route                  POST /election
// @description
// @acccess                ADMIN
exports.createElection = async (req, res, next) => {
    try {
        const body = await electionSchema.validateAsync(req.body);
        const election = await Election.create(body);

        res.status(200).json({
            status: 'success',
            data: election
        });

    } catch (error) {
        next(error);
    }
}


// @route                  POST /election/:id/post
// @description
// @acccess                ADMIN
exports.createPost = async (req, res, next) => {
    try {
        const relatedElection = req.params.id;
        const election = await Election.findOne({
            _id: relatedElection
        })
        if (!election) {
            throw new AppError('Oops..Election does not exist', 400);
        }
        // checkIfCanAddPost(election, next);

        //Check if election is active or ended and rebuke all edit
        // console.log(!(election.start > Date.now()))
        if (!(election.start > Date.now())) {
            throw new AppError('Cannot add a post while election is ongong or has ended', 400)
        }

        const payload = await postSchema.validateAsync(req.body);

        //is election onGoing


        //check if post does not already exist
        const existingPost = await Post.find({
            title: {
                $regex: payload.title,
                $options: "i"
            }
        }).where('election').equals(relatedElection);
        if (existingPost.length > 0) {
            throw new AppError('Post already exists', 400);
        }


        const post = new Post({
            ...payload,
            election: relatedElection
        });


        await post.save();

        election.posts.push(post._id);

        await election.save();

        res.status(200).json({
            status: 'success',
            data: post
        })

    } catch (error) {
        next(error);
    }
}


// @route                  POST /post/:id
// @description
// @acccess                ADMIN
exports.createCandidate = async (req, res, next) => {
    try {
        const relatedPost = req.params.id;
        const post = await Post.findOne({
            _id: relatedPost
        })
        if (!post) {
            throw new AppError('Oops..Post does not exist', 400);
        }
        // Checks if an election is going on or has eneded an prevents candidates to be added if election is ongoing or has ended
        // checkIfCanAddCandidate(Election, post.election, next);
        const election = await Election.findById(post.election);
        if (!(election.start > Date.now())) {
            throw new AppError('Cannot add a candidate while election is ongong or has ended', 400)
        }
        const payload = await candidateSchema.validateAsync(req.body);

        //check if candidate does not already exist
        const existingCandidate = await Candidate.find({
            name: {
                $regex: payload.fullname,
                $options: "i"
            }
        }).where('post').equals(relatedPost);
        if (existingCandidate.length > 0) {
            throw new AppError('Candidate already exists', 400);
        }

        const candidate = await new Candidate({
            ...payload,
            post: relatedPost
        });


        // console.log(req.file.path);
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            candidate.image = result.secure_url;
            candidate.cloudinary_id = result.public_id;
        }

        await candidate.save();

        post.candidates.push(candidate._id);

        post.save();


        res.status(201).json({
            message: 'Success',
            data: candidate
        });
    } catch (error) {
        next(error)
    }
}

exports.vote = async (req, res, next) => {
    try {

        // This is just a dummy code, blockchain code goes in here.....Verify that the user hasn't alreadyvoted and if they have not, store thier votes to the respective candidate on the blockchain.... 
        const votedCandidates = req.body;


        for (const candidateId of votedCandidates) {
            const candidate = await Candidate.findById(candidateId);
            if (!candidate) {
                throw new AppError('Candidate not found', 400);
            }
            candidate.votes += 1;
            await candidate.save();
        }
        res.status(200).json({
            status: 'success',
            message: 'Voted'
        })

    } catch (error) {
        next(error);
    }
}

exports.getAllElections = async (req, res, next) => {
    try {
        // const queryObj = {
        //     ...req.query
        // };
        // const excludedFields = ['page', 'sort', 'limit', 'fields'];
        // excludedFields.forEach(excludedField => delete queryObj[excludedField]);

        // Filtering
        // let queryStr = JSON.stringify(queryObj);
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // let query = Election.find(JSON.parse(queryStr));

        //Filtering
        let status = req.query.status || "all";
        status = status.toLowerCase()
        let query;
        let currentDate = new Date();

        switch (status) {
            case "active":
                query = Election.find({}).where('start').lt(currentDate).where('end').gt(currentDate);
                break;
            case "upcoming":
                query = Election.find({}).where('start').gt(currentDate);
                break;
            case "inactive":
                query = Election.find({}).where('end').lt(currentDate);
                break;
            default:
                query = Election.find({})

        }

        //Pagination
        const page = req.query.page * 1 || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numElections = await Election.countDocuments();
            if (skip >= numElections) throw new AppError('This page does not exist', 404);
        }

        let elections = await query;

        res.status(200).json({
            message: 'Success',
            data: elections
        });
    } catch (error) {
        next(error)
    }

}

exports.getElection = async (req, res, next) => {
    try {
        let electionId = req.params.id;
        const query = Election.findById(electionId);
        if (!query) {
            throw new AppError('Election not found', 400)
        }

        const election = await query.populate([{
            path: 'posts',
            select: '_id title'
            // populate: {
            //     path: 'candidates',
            //     select: '-post -updatedAt -createdAt -__v'
            // }
        }]);
        res.status(200).json({
            status: 'Success',
            data: election
        });

    } catch (error) {
        next(error)
    }
}

exports.getPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const query = Post.findById(postId);

        if (!query) {
            throw new AppError("Post not found", 400);
        }

        const post = await query.populate([{
            path: 'candidates'
        }])

        res.status(200).json({
            status: 'Success',
            data: post
        });

    } catch (error) {
        next(error)
    }
}