import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  badgeId: { type: String, required: true }, // e.g. 'first_task', 'early_bird', etc.
  title: { type: String, required: true },
  description: { type: String, required: true },
  unlockedAt: { type: Date, default: Date.now }
});

// Ensure a user can only unlock a specific badge once
AchievementSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

export const Achievement = mongoose.model("Achievement", AchievementSchema);
