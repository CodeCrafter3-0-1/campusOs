import { Schema, model } from "mongoose";

const scamReportSchema = new Schema(
  {
    input: { type: String, required: true },
    verdict: { type: String, enum: ["safe", "suspicious", "scam"], required: true },
    confidence: Number,
    reasons: [String],
    createdAt: String,
  },
  { timestamps: true },
);

export const ScamReportModel = model("ScamReport", scamReportSchema);
