import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  flowCoins: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date },
  weeklyProgress: { type: Number, default: 0 } // Completed tasks in current week
}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);
