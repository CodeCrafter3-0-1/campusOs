import { Schema, model } from "mongoose";

const projectSchema = new Schema(
  {
    title: String,
    description: String,
    stack: [String],
    link: String,
  },
  { _id: false },
);

const studentSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    collegeName: { type: String, required: true },
    course: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    passwordHash: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationStatus: { type: String, enum: ["verified", "pending", "unverified"], default: "unverified" },
    verificationMethod: { type: String, enum: ["college-email", "id-upload", "manual-review"], default: "manual-review" },
    badge: { type: String, default: "Verification Pending" },
    profileSlug: { type: String, required: true, unique: true },
    headline: String,
    bio: String,
    location: String,
    skills: [String],
    projects: [projectSchema],
    certifications: [String],
    resumeUrl: String,
    bookmarkedResourceIds: [String],
    bookmarkedJobIds: [String],
  },
  { timestamps: true },
);

export const StudentModel = model("Student", studentSchema);
