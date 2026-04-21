import { Schema, model } from "mongoose";

const jobSchema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    type: { type: String, enum: ["internship", "full-time", "part-time", "fellowship"], required: true },
    stipend: String,
    verified: { type: Boolean, default: false },
    postedAt: String,
    applyUrl: String,
    tags: [String],
    description: String,
    skillsRequired: [String],
  },
  { timestamps: true },
);

export const JobModel = model("Job", jobSchema);
