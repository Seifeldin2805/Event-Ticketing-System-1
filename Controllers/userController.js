const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const eventModel = require("../models/eventModel");

const userController = {
  register: async (req, res) => {
    try {
      const { email, password, name, role } = req.body;

      // Check if the user already exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Do NOT hash the password here, let the pre-save hook do it!
      const newUser = new userModel({
        email,
        password, // plain password, will be hashed by pre-save hook
        name,
        role,
      });

      // Save the user to the database
      await newUser.save();

      console.log("User completed"); // Print "User completed" in the console
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('Login attempt for:', email);
      const user = await userModel.findOne({ email });
      console.log('User found:', user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isPasswordValid);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      // Return the token and user details
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  logout: (req, res) => {
    try {
      res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      console.log("Fetching all users...");
      const users = await userModel.find(); // Fetch all users
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Build update object
      const updateFields = { name, email };
      if (password) {
        // Hash the new password before updating
        const salt = await bcrypt.genSalt(10);
        updateFields.password = await bcrypt.hash(password, salt);
      }

      // Find the user by ID and update their profile
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user.userId, // Extracted from the token by authMiddleware
        updateFields, // Fields to update
        { new: true, runValidators: true }
      ).select("-password -__v"); // Exclude password and version key from the response

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser); // Return the updated user details
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateUserRole: async (req, res) => {
    try {
      const { role } = req.body;

      // Validate the role
      const validRoles = ["user", "admin", "organizer"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      // Find the user by ID and update their role
      const updatedUser = await userModel.findByIdAndUpdate(
        req.params.id, // User ID from the URL
        { role }, // Update the role
        { new: true, runValidators: true } // Return the updated document and validate inputs
      ).select("-password -__v"); // Exclude password and version key from the response

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser); // Return the updated user details
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await userModel.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ user, msg: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      // Fetch the user from the database using the userId from the token
      const user = await userModel.findById(req.user.userId).select("-password -__v"); // Exclude the password and __v fields

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user); // Return the user details
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  forgetPassword: async (req, res) => {
    try {
      const { email, newPassword } = req.body;

      // Find the user by email
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update the user's password (plain, will be hashed by pre-save hook)
      user.password = newPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error in forgetPassword:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = userController;