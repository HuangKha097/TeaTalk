import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
// Signup a new user
export const signup = async (req, res) => {
  const { fullName, email, userName, password, bio } = req.body;

  try {
    if (!fullName || !email || !userName || !password) {
      return res.json({
        success: false,
        message: "The input is required",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        success: false,
        message: "The email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      userName,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);
    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//Controller to login a user
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.json({
        success: false,
        message: "Account does not exist",
      });
    }

    const passwordCompare = await bcrypt.compare(password, userData.password);
    if (!passwordCompare) {
      return res.json({
        success: false,
        message: "Your password is not correct",
      });
    }
    const token = generateToken(userData._id);
    res.json({
      success: true,
      userData,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Controller to check if user is authenticated
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// Controller to update user profile details
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, userName, fullName } = req.body;
    const userId = req.user._id;

    // check trùng userName
    const checkuserName = await User.findOne({ userName });
    if (checkuserName && checkuserName._id.toString() !== userId.toString()) {
      return res.json({
        success: false,
        message: "userName already exists",
      });
    }

    let updatedUser;

    if (profilePic && profilePic.trim() !== "") {
      // Có ảnh → upload lên Cloudinary
      console.log("Uploading to Cloudinary...");
      const upload = await cloudinary.uploader.upload(profilePic, {
        folder: "profile_pics",
        resource_type: "image",
      });

      console.log("Cloudinary URL:", upload.secure_url);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: upload.secure_url,
          bio,
          userName,
          fullName,
        },
        { new: true }
      );
    } else {
      // Không có ảnh → chỉ update text
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, userName, fullName },
        { new: true }
      );
    }

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
