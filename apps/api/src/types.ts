export type VerificationStatus = "verified" | "pending" | "unverified";

export type ScamVerdict = "safe" | "suspicious" | "scam";

export interface Student {
  id: string;
  fullName: string;
  email: string;
  collegeName: string;
  course: string;
  graduationYear: number;
  passwordHash: string;
  verified: boolean;
  verificationStatus: VerificationStatus;
  verificationMethod: "college-email" | "id-upload" | "manual-review";
  badge: string;
  profileSlug: string;
  headline: string;
  bio: string;
  location: string;
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
    stack: string[];
    link?: string;
  }>;
  certifications: string[];
  resumeUrl?: string;
  bookmarkedResourceIds: string[];
  bookmarkedJobIds: string[];
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  type: "notes" | "pdf" | "video" | "link";
  subject: string;
  description: string;
  url: string;
  tags: string[];
  level: "beginner" | "intermediate" | "advanced";
  source: string;
  offlineAvailable: boolean;
  scoreBoost?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "internship" | "full-time" | "part-time" | "fellowship";
  stipend: string;
  verified: boolean;
  postedAt: string;
  applyUrl: string;
  tags: string[];
  description: string;
  skillsRequired: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: "alert" | "resource" | "job" | "success";
  createdAt: string;
  read: boolean;
}

export interface ScamReport {
  id: string;
  input: string;
  verdict: ScamVerdict;
  confidence: number;
  reasons: string[];
  createdAt: string;
}
