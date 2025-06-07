const User = require("../Models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

const jwt = require("jsonwebtoken");

const generateToken = (user)=>{
    const accessToken = jwt.sign(
        {email:user.email, id:user._id, phone:user.phone, name:user.name},
        process.env.JWT_SECRET,
        {expiresIn: "15m"}
    );
    const refreshToken = jwt.sign(
        {email:user.email, id:user._id, phone:user.phone, name:user.name},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: "7d"}
    )
    return {accessToken, refreshToken}
}

const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res
        .status(409)
        .json({ message: "User already exists, please login instead" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
    });
    await user.save();
    res
      .status(201)
      .json({ message: "Your account created successfully", user: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({
          message: "No user found with this email, please signup",
          success: false,
        });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res
        .status(401)
        .json({ message: "Incorrect password", success: false });
    }
    const{ accessToken, refreshToken } = generateToken(user);
     res.cookie("refreshToken", refreshToken,{
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 
    })
        res
      .status(200)
      .json({
        message: "login Successfully",
        success: true,
        accessToken,
        email,
        id:user._id,
        name: user.name,
        phone: user.phone,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const refreshAccessToken =async(req, res)=>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({message:"Please login first"})
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(err, decoded)=>{
        if(err){
            return res.status(403).json({message:"Invalid refresh token"})
        }
        const newAccessToken = jwt.sign(
      {id: decoded.id, name:decoded.name},
      process.env.JWT_SECRET,
      {expiresIn:"15m"}
    )
    console.log("under refresh token")
    res.json({ accessToken: newAccessToken});
    })
}

module.exports = { signup, login, refreshAccessToken };
