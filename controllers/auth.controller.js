import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/jwt.js";
import { uploadToCloudinary } from "../utils/uploadHelper.js";

// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    console.log("Register request body:", req.body);
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password) {
      console.log("Register failed: Missing fields"); // Debug log
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      console.log("Register failed: User already exists"); // Debug log  
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user),
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
          bio: user.bio,
          joinedClubs: user.joinedClubs
        }
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        token: generateToken(user),
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
          bio: user.bio,
          joinedClubs: user.joinedClubs
        }
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @route   GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('joinedClubs');
    if (user) {
      res.json({
        success: true,
        data: user
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.bio = req.body.bio || user.bio;

      if (req.body.avatar) {
        const avatarUrl = await uploadToCloudinary(req.body.avatar);
        if (avatarUrl) {
          user.avatar = avatarUrl;
        }
      }

      const updatedUser = await user.save();
      // Re-populate to ensure consistent response
      await updatedUser.populate('joinedClubs');

      res.json({
        success: true,
        data: updatedUser
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
