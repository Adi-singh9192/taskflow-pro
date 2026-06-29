import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/User.js";

const router = Router();
const getSecret = () => process.env.JWT_SECRET || "fallback_secret_for_dev";

// Validate email helper
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

router.post("/register", async (req, res) => {
  console.log(`[AUTH] Incoming register request for email: ${req.body?.email}`);
  try {
    const { name, email, password } = req.body;
    
    // 1. Detailed database connection check
    const dbStatus = mongoose.connection.readyState;
    console.log(`[AUTH] Mongoose connection state: ${dbStatus} (0=disconnected, 1=connected, 2=connecting, 3=disconnecting)`);
    if (dbStatus !== 1) {
      console.error("[AUTH] Registration failed: MongoDB is not connected.");
      return res.status(503).json({ error: "Database service is currently unavailable. Please try again later." });
    }

    // 2. Input validation
    if (!name || !email || !password) {
      console.warn("[AUTH] Registration validation failed: Missing name, email, or password.");
      return res.status(400).json({ error: "All fields (name, email, password) are required." });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      console.warn("[AUTH] Registration validation failed: Name cannot be empty.");
      return res.status(400).json({ error: "Name cannot be empty." });
    }

    if (!isValidEmail(trimmedEmail)) {
      console.warn(`[AUTH] Registration validation failed: Invalid email format: ${trimmedEmail}`);
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    if (password.length < 6) {
      console.warn("[AUTH] Registration validation failed: Password too short.");
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    // 3. Database operation
    console.log(`[AUTH] Checking if email ${trimmedEmail} already exists in DB...`);
    const existing = await User.findOne({ email: trimmedEmail });
    if (existing) {
      console.warn(`[AUTH] Registration failed: Email ${trimmedEmail} already exists.`);
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    console.log("[AUTH] Hashing password...");
    const passwordHash = await bcrypt.hash(password, 10);

    console.log(`[AUTH] Creating user document in MongoDB for ${trimmedEmail}...`);
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      passwordHash,
      xp: 0,
      level: 1,
      flowCoins: 0,
      currentStreak: 0,
      weeklyProgress: 0
    });

    console.log(`[AUTH] User successfully created in MongoDB. User ID: ${user._id}`);

    // 4. Token generation
    const token = jwt.sign({ userId: user._id }, getSecret(), { expiresIn: "7d" });
    
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        flowCoins: user.flowCoins,
        currentStreak: user.currentStreak,
        weeklyProgress: user.weeklyProgress
      }
    });

  } catch (err: any) {
    console.error("[AUTH] Registration experienced an unhandled exception:", err);
    return res.status(500).json({ error: err.message || "An unexpected server error occurred during registration." });
  }
});

router.post("/login", async (req, res) => {
  console.log(`[AUTH] Incoming login request for email: ${req.body?.email}`);
  try {
    const { email, password } = req.body;

    // 1. Database connection check
    const dbStatus = mongoose.connection.readyState;
    console.log(`[AUTH] Mongoose connection state: ${dbStatus} (0=disconnected, 1=connected, 2=connecting, 3=disconnecting)`);
    if (dbStatus !== 1) {
      console.error("[AUTH] Login failed: MongoDB is not connected.");
      return res.status(503).json({ error: "Database service is currently unavailable. Please try again later." });
    }

    // 2. Input validation
    if (!email || !password) {
      console.warn("[AUTH] Login validation failed: Missing email or password.");
      return res.status(400).json({ error: "Email and password are required." });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 3. Authenticate against database only (strictly no mock auto-registers or default mock credentials!)
    console.log(`[AUTH] Querying MongoDB for user email: ${trimmedEmail}`);
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      console.warn(`[AUTH] Login failed: User not found with email ${trimmedEmail}`);
      return res.status(401).json({ error: "Invalid email or password." });
    }

    console.log("[AUTH] User found in MongoDB. Comparing password hashes...");
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.warn(`[AUTH] Login failed: Password mismatch for user ${trimmedEmail}`);
      return res.status(401).json({ error: "Invalid email or password." });
    }

    console.log(`[AUTH] Password match successful for user ${trimmedEmail}. Generating session JWT...`);
    const token = jwt.sign({ userId: user._id }, getSecret(), { expiresIn: "7d" });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        flowCoins: user.flowCoins,
        currentStreak: user.currentStreak,
        weeklyProgress: user.weeklyProgress
      }
    });

  } catch (err: any) {
    console.error("[AUTH] Login experienced an unhandled exception:", err);
    return res.status(500).json({ error: err.message || "An unexpected server error occurred during login." });
  }
});

export const authRoutes = router;
