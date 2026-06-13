import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Worker from "../models/workerModel.js";


export const registerUser = async (req, res) => {
  try {
    
    const { name, phone, password, role } = req.body;

    if (!/^\d{10}$/.test(phone)) {
  return res.status(400).json({
    message: "Phone number must be exactly 10 digits",
  });
}

    if (!name || !phone || !password || !role) {
      return res.status(400).json({
        message: "Name, phone and role are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this phone number",
      });
    }

    const user = await User.create({
      name,
      phone,
      password,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login User (Phone-based)
export const loginUser = async (req, res) => {
  try {
    const { phone , password} = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
