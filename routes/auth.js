import express from "express";
import User from "../models/User.js";

const router = express.Router();
// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists"
      });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    res.json({
      message: "Signup successful",
      user
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});
// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
      password
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid credentials"
      });
    }
    res.json({
      message: "Login successful",
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});

export default router;