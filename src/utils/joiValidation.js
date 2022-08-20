const Joi = require('joi');


const registerSchema = Joi.object({
    first_name: Joi.string().required().lowercase().trim().min(3).max(13),

    last_name: Joi.string().required().lowercase().trim().min(3).max(13),

    username: Joi.string().required().lowercase().trim().min(3).max(13),

    email: Joi.string().trim().email({minDomainSegments:2,tlds:{allow:['com','net']}}).required(),

    role: Joi.string().trim().valid('USER').messages({
        'any.only': 'role can only be a USER'
    }),

    password: Joi.string().trim().min(8).required(),

    confirm_password: Joi.string().trim().min(8).valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirm password must match with password'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().trim().email({minDomainSegments:2,tlds:{allow:['com','net']}}).required(),

    password: Joi.string().trim().min(8).required(),
})

const recoverPasswordEmailSchema = Joi.object({
    email: Joi.string().trim().email({minDomainSegments:2,tlds:{allow:['com','net']}}).required()
})

const PasswordSchema = Joi.object({
    password: Joi.string().trim().min(8).required(),

    confirm_password: Joi.string().trim().min(8).valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirm password must match with password'
    })
})

const postSchema = Joi.object({
    title: Joi.string().trim().required().max(50),
    body: Joi.string().trim().required(),
})

const commentSchema = Joi.object({
    body: Joi.string().trim().required()
});

const adminSchema = Joi.object({
    first_name: Joi.string().lowercase().trim().required().min(3).max(13),

    last_name: Joi.string().lowercase().trim().required().min(3).max(13),

    username: Joi.string().lowercase().trim().required().min(3).max(13),

    email: Joi.string().trim().email({minDomainSegments:2,tlds:{allow:['com','net']}}).required(),

    role: Joi.string().trim().valid('USER','ADMIN').messages({
        'any.only': 'role can only be a USER or ADMIN'
    }),

    password: Joi.string().trim().min(8).required(),

    confirm_password: Joi.string().trim().min(8).valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirm password must match with password'
    })
});
module.exports = {registerSchema,loginSchema,recoverPasswordEmailSchema,PasswordSchema,postSchema,commentSchema,adminSchema};