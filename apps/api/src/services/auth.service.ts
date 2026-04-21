import bcrypt from "bcryptjs";
import { dataStore } from "../repositories/data-store";
import { HttpError } from "../utils/http-error";
import { createId } from "../utils/id";
import { signToken } from "../utils/jwt";

const trustedCollegeDomains = [".edu", ".ac.in", "lpu.in", "lpu.edu.in", "vit.ac.in", "amity.edu"];

interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  collegeName: string;
  course: string;
  graduationYear: number;
}

export async function registerStudent(input: RegisterInput) {
  const existingStudent = dataStore.findStudentByEmail(input.email);

  if (existingStudent) {
    throw new HttpError(409, "Student account already exists for this email.");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const emailDomain = input.email.split("@")[1]?.toLowerCase() ?? "";
  const isTrustedDomain = trustedCollegeDomains.some((domain) => emailDomain.endsWith(domain));
  const slug = `${input.fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${createId("slug").replace("slug_", "")}`;

  const student = dataStore.addStudent({
    fullName: input.fullName,
    email: input.email,
    passwordHash,
    collegeName: input.collegeName,
    course: input.course,
    graduationYear: input.graduationYear,
    verified: isTrustedDomain,
    verificationStatus: isTrustedDomain ? "verified" : "pending",
    verificationMethod: isTrustedDomain ? "college-email" : "manual-review",
    badge: isTrustedDomain ? "Verified Student" : "Verification Pending",
    profileSlug: slug,
    headline: "Student building a trusted campus-ready profile on CampusOS.",
    bio: "Add your projects, skills, certifications, and verified identity to unlock trusted opportunities.",
    location: "India",
    skills: [],
    projects: [],
    certifications: [],
    resumeUrl: "",
    bookmarkedJobIds: [],
    bookmarkedResourceIds: [],
  });

  const token = signToken({ studentId: student.id, email: student.email });

  return {
    token,
    student,
  };
}

export async function loginStudent(email: string, password: string) {
  const student = dataStore.findStudentByEmail(email);

  if (!student) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, student.passwordHash);

  if (!isMatch) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const token = signToken({ studentId: student.id, email: student.email });

  return { token, student };
}
