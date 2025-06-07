const nodemailer = require("nodemailer");
const User = require("../Models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// const twilio = require("twilio"); // Commented for now
require("dotenv").config();
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  tls:{
    rejectUnauthorized: false, // Allow self-signed certificates
  }
});

// Commented SMS setup for future use
// const twilioClient = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

const forgetPass = async (req, res) => {
  try {
    const { email, phone } = req.body;
    let user;

    if (email) {
      user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found, Please enter correct email" });
      }
    } else if (phone) {
      // Temporarily disabled SMS functionality
      return res.status(400).json({
        message: "SMS service temporarily unavailable. Please use email instead.",
      });
    } else {
      return res.status(400).json({ message: "Email is required" });
    }

    const generatedOtp = crypto.randomInt(100000, 999999).toString();
    user.otp = generatedOtp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send email OTP
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${generatedOtp}. It is valid for 10 minutes.`,
    });

    // SMS functionality commented for future use
    // if (phone) {
    //   await twilioClient.messages.create({
    //     body: `Your OTP for password reset is ${generatedOtp}. It is valid for 10 minutes.`,
    //     from: process.env.TWILIO_PHONE_NUMBER,
    //     to: phone,
    //   });
    // }

    const resetPayload = { email }; // Only email for now
    const resetToken = jwt.sign(resetPayload, process.env.RESET_PASS_SECRET, {
      expiresIn: "15m",
    });

    return res
      .status(200)
      .json({ message: "OTP sent to your email successfully", resetToken });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, otp, resetToken } = req.body;
    if (!resetToken) {
      return res.status(400).json({ message: "Reset token is required" });
    }
    let payload;
    try {
      payload = jwt.verify(resetToken, process.env.RESET_PASS_SECRET);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }
    const user = await User.findOne(
      payload.email ? { email: payload.email } : { phone: payload.phone }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (otp !== user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  forgetPass,
  resetPassword,
};
