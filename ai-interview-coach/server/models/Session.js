const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    overall: { type: Number, required: true },
    technical: { type: Number, required: true },
    communication: { type: Number, required: true },
    problemSolving: { type: Number, required: true },
    confidence: { type: Number, required: true },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    topics: [{ type: String }],
    summary: { type: String, required: true },
  },
  { _id: false }
);

const MessageSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const SessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    difficulty: { type: String, required: true },
    mode: { type: String, required: true },
    messages: [MessageSchema],
    feedback: FeedbackSchema,
    duration: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Session", SessionSchema);
