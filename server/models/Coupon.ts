import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  brandName: { type: String, required: true }, // e.g. 'Amazon', 'Flipkart', 'Spotify'
  title: { type: String, required: true }, // e.g. '$10 Gift Card'
  code: { type: String, required: true }, // generated coupon code
  discountValue: { type: String, required: true },
  coinsCost: { type: Number, required: true },
  isRedeemed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Coupon = mongoose.model("Coupon", CouponSchema);
