const {
    electionSchema,
    postSchema,
    candidateSchema
} = require('../utils/joiValidation');
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
        const payload = await postSchema.validateAsync(req.body);
        const posts = payload.map(post =>
            new Post({
                ...post,
                election: relatedElection
            })
        )

        const Electionposts = await Post.create(posts);


        res.status(200).json({
            status: 'success',
            data: Electionposts
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
        const payload = await candidateSchema.validateAsync(req.body);

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

        await post.save();

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
        let status = req.query.status.toLowerCase() || "all";
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
        // need to add filter for active ones
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
        const election = await Election.findById(electionId);
        if (!election) {
            throw new AppError('Election not found', 400)
        }
        res.status(200).json({
            status: 'Success',
            data: election
        });

    } catch (error) {
        next(error)
    }
}