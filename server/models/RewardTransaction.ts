import mongoose from "mongoose";

const RewardTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["earn", "redeem"], required: true },
  amountXp: { type: Number, default: 0 },
  amountCoins: { type: Number, default: 0 },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const RewardTransaction = mongoose.model("RewardTransaction", RewardTransactionSchema);
