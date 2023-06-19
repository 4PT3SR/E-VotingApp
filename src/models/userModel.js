const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('../utils/AppError')
// const {Scehma} = mongoose;

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    matric_number: {
        type: String,
        required: true,
        unique: [true, 'Matric number is already registered']
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Email already registered']
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    isAdmin: {
        type: Boolean,
        default: false,
        validate: {
            validator: function () {
                if (this.role === 'ADMIN') {
                    this.isAdmin = true
                }
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    password_reset_token: {
        type: String
    },
    password_reset_token_expiry: {
        type: Date
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next()
})

userSchema.statics.getCredentials = async function (matric_number, password) {

    let user = await User.findOne({
        matric_number
    });
    let errResponse = 'Incorrect Matric Number or Password'
    if (!user) {
        throw new AppError(errResponse, 400);
    }
    let isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new AppError(errResponse, 400);
    }
    return user;
}

//  userSchema.methods.generateAuthToken = async function() {
//     const user = this;
//     let token = jwt.sign({_id:user._id.toString()},process.env.jwt_secret);
//     user.tokens = user.tokens.concat({token});
//     await user.save();
//     return token;

// }

// userSchema.methods.generatePasswordResetToken = function() {
//     const user = this;
//     const passwordResetToken = crypto.randomBytes(32).toString('hex');
//     user.password_reset_token = crypto.createHash('sha256').update(passwordResetToken).digest('hex');
//     user.password_reset_token_expiry = Date.now() + 5 * 60 * 1000;
//     user.save();
//     return passwordResetToken;
// }

userSchema.methods.toJSON = function () {

    const user = this;
    let userObject = user.toObject();
    // delete userObject.tokens
    delete userObject.password
    delete password_reset_token
    delete password_reset_token_expiry
    delete __v
    delete tokens
    return userObject;
}

const User = new mongoose.model('User', userSchema);


module.exports = User;