const User = require("../Models/user");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

const getUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select(
      "-password -otp -otpExpiry"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email, subject } = req.body;
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Always send OTP to the user's current email, not to a new phone/email.
    // The frontend should send the user's current email in the payload.
    const checkEmail = await User.findOne({ email });
    if (!checkEmail) {
      return res.status(404).json({ message: "Email not found" });
    }
    const generatedOtp = crypto.randomInt(100000, 999999).toString();
    user.otp = generatedOtp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Email Change OTP",
      text: `Your OTP for ${subject} change is ${generatedOtp}. It is valid for 10 minutes.`,
    });
    return res.status(200).json({ message: "OTP sent to your email", otp: generatedOtp });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateUserData = async (req, res) => {
  try {
    const { newEmail, newName, newPassword, newPhone, otp } = req.body;
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (newEmail) {
      const checkNewEmail = await User.findOne({ email: newEmail });
      if (checkNewEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (otp !== user.otp || !user.otp || user.otpExpiry < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      user.email = newEmail;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return res.status(200).json({ message: "Email updated successfully" });
    }
    if (newPhone) {
      const checkNewPhone = await User.findOne({ phone: newPhone });
      if (checkNewPhone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
      if (otp !== user.otp || !user.otp || user.otpExpiry < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      user.phone = newPhone;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return res.status(200).json({ message: "Phone number updated successfully" });
    }
    if (newName) {
      user.name = newName;
      await user.save();
      return res.status(200).json({ message: "Name updated successfully" });
    }
    if (newPassword) {
      if (otp !== user.otp || !user.otp || user.otpExpiry < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return res.status(200).json({ message: "Password updated successfully" });
    }
    // Add a response if no valid update field is provided
    return res.status(400).json({ message: "No valid update field provided" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getUserData,
  sendOtp,
  updateUserData,
};
