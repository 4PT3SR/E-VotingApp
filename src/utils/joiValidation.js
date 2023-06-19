const Joi = require('joi');


const registerSchema = Joi.object({
  matric_number: Joi.string().required().trim().max(13).regex(/.*\/.*/).messages({
    'any.only': 'Invalid Matric Number',
    'string.pattern.base': 'Invalid Matric Number'
  }),
  password: Joi.string().required().trim().min(6),

});

const loginSchema = Joi.object({
  matric_number: Joi.string().required().trim().max(13).regex(/.*\/.*/).messages({
    'any.only': 'Invalid Matric Number'
  }),
  password: Joi.string().trim().min(6).required(),
})

const electionSchema = Joi.object({
  title: Joi.string().required(),
  // start: Joi.string().isoDate().regex(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}(\.\d{1,3})?)$/).min(Date.now()).required(),
  // start: Joi.date().iso().min().required(),
  // end: Joi.string().isoDate().regex(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}(\.\d{1,3})?)$/).min(Joi.ref('startDate')).required(),
  start: Joi.date().iso().greater(new Date(Date.now() + 60 * 60 * 1000)).required().messages({
    'date.greater': 'start Date/Time must be greater'
  }),
  end: Joi.date().iso().greater(Joi.ref('start')).required().messages({
    'date.greater': 'Date must be greater than start time'
  }),
  election_type: Joi.string().valid('College', 'Department', 'General').required(),
  college_eligibility: Joi.when('election_type', {
    is: 'College',
    then: Joi.string().required()
  }),
  department_eligibility: Joi.when('election_type', {
    is: 'Department',
    then: Joi.string().required()
  }),
});
// department_eligibility: Joi.array().items(Joi.string()),

// const postSchema = Joi.object({
//   title: Joi.string().trim().required()
// })
const postSchema = Joi.array().items(
  Joi.object({
    title: Joi.string().required()
  }).required()
);

const candidateSchema = Joi.object({
  name: Joi.string().required(),

})

module.exports = {
  registerSchema,
  loginSchema,
  electionSchema,
  postSchema,
  candidateSchema
};






// const postSchema = posts: Joi.array()
// .items(
//   Joi.object({
//     title: Joi.string().required(),
//     candidates: Joi.array().items(Joi.object({
//       name: Joi.string().required(),
//       image: Joi.image(),
//     })).min(1).required()

//   })
// )
// .min(2)
// .required(),
// first_name: Joi.string().required().lowercase().trim().min(3).max(13),

// last_name: Joi.string().required().lowercase().trim().min(3).max(13),

// username: Joi.string().required().lowercase().trim().min(3).max(13),

// const recoverPasswordEmailSchema = Joi.object({
//     email: Joi.string().trim().email({minDomainSegments:2,tlds:{allow:['com','net']}}).required()
// })

// const PasswordSchema = Joi.object({
//     password: Joi.string().trim().min(8).required(),

//     confirm_password: Joi.string().trim().min(8).valid(Joi.ref('password')).required().messages({
//         'any.only': 'Confirm password must match with password'
//     })
// })

// const postSchema = Joi.object({
//     title: Joi.string().trim().required().max(50),
//     body: Joi.string().trim().required(),
// })

// const commentSchema = Joi.object({
//     body: Joi.string().trim().required()
// });

// const adminSchema = Joi.object({
//     first_name: Joi.string().lowercase().trim().required().min(3).max(13),

//     last_name: Joi.string().lowercase().trim().required().min(3).max(13),

//     username: Joi.string().lowercase().trim().required().min(3).max(13),

//     email: Joi.string().trim().email({minDomainSegments:2,tlds:{allow:['com','net']}}).required(),

//     role: Joi.string().trim().valid('USER','ADMIN').messages({
//         'any.only': 'role can only be a USER or ADMIN'
//     }),

//     password: Joi.string().trim().min(8).required(),

//     confirm_password: Joi.string().trim().min(8).valid(Joi.ref('password')).required().messages({
//         'any.only': 'Confirm password must match with password'
//     })
// });