const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
const AppError = require('../utils/AppError')

const electionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    election_type: {
        type: String,
        enum: ['College', 'Department', 'General']
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }],
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    college_eligibility: {
        type: String
    },
    department_eligibility: {
        type: String
    }
}, {
    timestamps: true
});



const Election = new mongoose.model('election', electionSchema);


module.exports = Election;