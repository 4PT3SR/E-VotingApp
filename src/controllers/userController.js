const puppeteer = require('puppeteer');
const {
  registerSchema,
  loginSchema
} = require('../utils/joiValidation');
const Data = require('../models/dataModel');
const User = require('../models/userModel')
const AppError = require('../utils/AppError');
// const crypto = require('crypto');
const extractName = require('../helpers/extractName');
// const sendMail = require('../utils/sendMail');
const generateToken = require('../utils/genAuthToken');

// --- Smart Contract Start
const contract = require("../helpers/contract_connect");
// --- Smart Contract End

// @route                  POST /register
// @description
// @acccess                PUBLIC
exports.register = async (req, res, next) => {
  try {
    const body = await registerSchema.validateAsync(req.body);
    const browser = await puppeteer.launch({});

    const page = await browser.newPage();
    await page.goto('https://portal.bellsuniversity.edu.ng/');
    await page.waitForSelector('#mat');
    await page.type('#mat', body.matric_number);
    await page.type('#pass', body.password);
    await page.click(".btn.btn-warning.pull-right");
    const pageTitle = await page.evaluate(() => document.title);
    const loginError = pageTitle.includes('Login Page');
    if (loginError) {
      throw new AppError('Invalid Matric Number/Passsword', 201);
    }
    await page.waitForSelector('.middle-nav');
    await page.click('a[href="profile.php"]');
    await page.waitForSelector('#DataTables_Table_0');
    const bioData = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.dataTable tbody tr td u'), e => e.textContent)
    })

    let selectedData = bioData.filter((_, index) => (index + 1) % 2 === 0);

    await browser.close();
    const fullname = extractName(selectedData[1]);
    let studentInfo = {
      matric_number: selectedData[0],
      last_name: fullname[0],
      first_name: fullname[1],
      level: selectedData[21],
      faculty: selectedData[23],
      department: selectedData[22],
      email: selectedData[7],
      password: body.password

    }
    //data for colleges and departments are already set before hand through the data route
    const college = await Data.findOne({
      title: 'colleges'
    });
    const department = await Data.findOne({
      title: 'departments'
    });
    // console.log(college, college.data, department);
    if (!college.data.includes(studentInfo.faculty)) {
      college.data.push(studentInfo.faculty);
      await college.save()
    }

    if (!department.data.includes(studentInfo.department)) {
      department.data.push(studentInfo.department);
      await department.save()
    }




    //TODO: Contract.registerVoter() -> await
    //wait for endpoint to finish execution before moving to next stage 
    let contract_call = await contract();
    await contract_call.registerVoter(studentInfo.matric_number, studentInfo.email);


    await User.create(studentInfo);
    res.status(200).json({
      status: 'Success',
      message: 'Student registered successfuly'
    });



  } catch (error) {
    next(error);
  }
}



// @route                  POST /login
// @description
// @acccess                PUBLIC
exports.login = async (req, res, next) => {
  try {
    const payload = await loginSchema.validateAsync(req.body);
    const {
      matric_number,
      password
    } = payload;
    const user = await User.getCredentials(matric_number, password);
    const authToken = generateToken(res, user._id);
    res.status(200).json({
      status: 'success',
      user,
      authToken
    });

  } catch (error) {
    next(error);
  }
}


// @route                  POST /logout
// @description
// @acccess                auth(user,manager,admin,staff)

// exports.logout = async (req, res, next) => {
// try { 
//     let user = req.user
//     let currentToken = req.authToken;
//     user.tokens = user.tokens.filter(token =>{
//     return token.token !== currentToken;
//  });
//  await user.save()
//  res.status(200).json({status: 'Success',message:'Logged out sucessfully'});
//  } catch (err) {
//      next(e);
//  }

// res.cookie('jwt', '', {
//   httpOnly: true,
//   expires: new Date(0)
// })

// res.status(200).json({
//   message: 'Logged out'
// })

// }



// @route                  POST /logoutall
// @description
// @acccess                auth(user,manager,admin,staff)

//  exports.logoutAll = async (req,res,next) => {
//      try { 
//          req.user.tokens = [];
//          res.status(200).json({status: 'Success',message:'Logged out of all devices sucessfully'})
//      } catch (error) {
//         next(error);
//      }
//  }

// @route                  POST /resetpassword
// @description
// @acccess                PUBLIC

// exports.resetPassword = async (req,res,next) => {
//     try {
//         let payload = await recoverPasswordEmailSchema.validateAsync(req.body);
//         const {email} = payload;
//         const user = await User.findOne({email:email});
//         if(!user) {
//             throw new AppError('User with this email does not exist',400);
//         }
//             // Verification Token Generation
//         let passwordResetToken = await user.generatePasswordResetToken();

//         let verificationUrl = `${req.protocol}://${req.get('host')}/resetpassword/${passwordResetToken}`;
//         const message = `Hello ${user.first_name}, /n Follow this to reset your password, link expires in 5mins /n ${verificationUrl}`;

//         await sendMail({
//             email: email,
//             subject: `Reset Password`,
//             message
//         })

//         res.status(200).json({status: 'Success',message:'Check your mail to reset password'})
//     } catch (error) {
//         next(error)
//     }
// }


// @route                  POST /resetpassword?:passwordresetToken
// @description
// @acccess                PUBLIC

// exports.setPassword = async (req,res,next) => {
//     try {
//         const passwords = await PasswordSchema.validateAsync(req.body);
//         const {password} = passwords;
//         let passwordresetToken = req.params.passwordresetToken;
//         let hashed = crypto.createHash('sha256').update(passwordresetToken).digest('hex');


//         let user = await User.findOne({password_reset_token:hashed})
//             if(!user) {
//                 throw new AppError('Token is invalid or has expired',400);
//             }

//             user.password = password;
//             user.password_reset_token = undefined;
//             user.password_reset_token_expiry = undefined;
//             await user.save();
//         res.status(200).json({status: 'Success', message:'Password has been reset, Login with your new Password'})
//     } catch (e) {
//         next(e);
//     }
// }



// @route                  POST /staff
// @description
// @acccess                auth(staff)

//  exports.staff = async (req,res,next) => {
//     try{
//         const user = req.user;
//         res.status(200).json({status: 'success',message:'This is a protected route for staffs',user})
//     } catch (error) {
//         next(error)
//     }
//  }


// @route                  POST /manager
// @description
// @acccess                auth(manager)

//  exports.manager = async (req,res,next) => {
//     try{
//         const user = req.user;
//         res.status(200).json({status: 'success',message:'This is a protected route for managers',user})
//     } catch (error) {
//         next(error)
//     }
//  }


// @route                  POST /admin
// @description
// @acccess                auth(admin)

//  exports.admin = async (req,res,next) => {
//     try{
//         const user = req.user;
//         res.status(200).json({status: 'success',message:'This is a protected route for user',user})
//     } catch (error) {
//         next(error)
//     }
//  }