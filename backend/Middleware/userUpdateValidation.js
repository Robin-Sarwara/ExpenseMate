const Joi = require('joi');

// Validation for sendOtp
const sendOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  subject: Joi.string().required(),
});

const validateSendOtp = (req, res, next) => {
  const { error } = sendOtpSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Validation for updateUserData
const updateUserSchema = Joi.object({
  newEmail: Joi.string().email(),
  newName: Joi.string().min(1),
  newPassword: Joi.string().min(6),
  newPhone: Joi.string().pattern(/^\d{10,15}$/),
  otp: Joi.string().length(6),
}).or('newEmail', 'newName', 'newPassword', 'newPhone'); // At least one required

const validateUserUpdate = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateSendOtp,
  validateUserUpdate,
};
