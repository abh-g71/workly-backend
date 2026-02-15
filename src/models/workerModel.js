import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Worker = mongoose.model("Worker", workerSchema);
export default Worker;
