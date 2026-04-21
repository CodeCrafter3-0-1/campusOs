export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  collegeName: string;
  course: string;
  graduationYear: number;
  verified: boolean;
  verificationStatus: "verified" | "pending" | "unverified";
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
}

export interface ResourceItem {
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
  semanticScore?: number;
}

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
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

export interface ScamAnalysis {
  id: string;
  verdict: "safe" | "suspicious" | "scam";
  confidence: number;
  reasons: string[];
  aiSummary: string;
}
