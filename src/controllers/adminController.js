const {adminSchema} = require('../utils/joiValidation');
const User = require('../models/userModel');



exports.registerAdmin = async (req,res,next) => {
    try {
      const body = await adminSchema.validateAsync(req.body);
      await User.create(body);
      res.status(200).json({status:'Success',message:'User has been registered'});
    } catch (error) {
      next(error);
    }
}