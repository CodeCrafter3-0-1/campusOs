import { Schema, model } from "mongoose";

const resourceSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["notes", "pdf", "video", "link"], required: true },
    subject: { type: String, required: true },
    description: String,
    url: String,
    tags: [String],
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    source: String,
    offlineAvailable: { type: Boolean, default: false },
    scoreBoost: Number,
  },
  { timestamps: true },
);

export const ResourceModel = model("Resource", resourceSchema);
