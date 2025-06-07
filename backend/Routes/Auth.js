const { signup, login } = require("../Controller/AuthController");
const { forgetPass, resetPassword } = require("../Controller/ForgetPassController");
const { signupValidation, loginValidation, forgetPasswordValidation, resetPasswordValidation } = require("../Middleware/AuthValidation");

const router = require("express").Router();
router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.post("/forget-password", forgetPasswordValidation, forgetPass );
router.put("/reset-password", resetPasswordValidation, resetPassword);

module.exports = router