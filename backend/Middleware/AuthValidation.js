const joi = require('joi');

// Validation middleware for user signup, login, forget password, and reset password

const signupValidation = (req, res, next)=>{
    const schema = joi.object({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(20).required(),
        phone: joi.string().pattern(/^[0-9]{10}$/).required()
    }); 
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).json({message:error.message, error: error.message});
    }
    next();
}

const loginValidation = (req, res, next)=>{
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    })
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).json({message:"Invalid email or password", error: error.message});
    }
    next();
}
const forgetPasswordValidation = (req, res, next)=>{
    const schema = joi.object({
        email: joi.string().email(),
        // phone: joi.string().pattern(/^[0-9]{10}$/)
    })
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).json({message:error.message, error: error.message});
    }
    if(!req.body.email){
        return res.status(400).json({message:"Email or Phone is required"});
    }
    next();
}

const resetPasswordValidation = (req, res, next)=>{
    const schema  = joi.object({
        newPassword: joi.string().min(6).max(20).required(),
        otp: joi.string().length(6).pattern(/^[0-9]+$/).required(),
        resetToken: joi.string().required()
    })
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).json({message:"Bad request", error: error.message});
    }
    next();
}

module.exports = {signupValidation, loginValidation, resetPasswordValidation, forgetPasswordValidation};