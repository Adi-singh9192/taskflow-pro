import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["To Do", "In Progress", "Review", "Done", "Verified Completed"], default: "To Do" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  dueDate: { type: Date },
  estimatedEffort: { type: String },
  board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // Submission proof details
  submissionProof: {
    proofType: { type: String }, // 'Screenshot' | 'PDF' | 'GitHub Repository' | 'Live Website URL' | 'Google Drive Link' | 'Image' | 'Video' | 'Document' | 'External URL'
    proofValue: { type: String }, // URL or link or text description of proof
    submittedAt: { type: Date }
  },
  
  // Verification details
  verificationResult: {
    verified: { type: Boolean, default: false },
    completionScore: { type: Number },
    confidence: { type: Number },
    quality: { type: String },
    reasoning: { type: String },
    reward: {
      xp: { type: Number, default: 0 },
      coins: { type: Number, default: 0 },
      badge: { type: String }
    },
    verifiedAt: { type: Date }
  }
}, { timestamps: true });

export const Task = mongoose.model("Task", TaskSchema);
