import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import { generateToken } from "../middleware/authMiddleware.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const sanitizedUsers = users.map((userDoc) => {
      const { password, ...rest } = userDoc.toObject();
      return rest;
    });
    res.json(sanitizedUsers);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  try {
    const existingUser = await userisexists(email);

    if (!existingUser) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }
    const userData = await User.findOne({ email });

    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    const { password: _, ...userWithoutPassword } = userData.toObject();
    const token = generateToken(userData);

    res.json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during login",
      error: error.message,
    });
  }
};

export const userisexists = async (email) => {
  try {
    const existingUser = await User.findOne({ email });
    return !!existingUser; // Returns true if user exists, false otherwise
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

export const createUser = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({
      message: "Name, email, and password are required.",
    });
  }

  try {
    const data = req.body;

    if (await userisexists(data.email)) {
      return res.status(400).json({
        message: "User with this email already exists.",
      });
    }

    // 🔐 hash password
    const saltRounds = 10;
    data.password = await bcrypt.hash(data.password, saltRounds);

    const newUser = new User(data);
    await newUser.save();

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    const token = generateToken(newUser);

    res.status(201).json({
      ...userWithoutPassword,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};
