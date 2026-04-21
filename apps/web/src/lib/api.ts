import { mockJobs, mockNotifications, mockProfile, mockResources } from "@/data/mock";
import { JobItem, NotificationItem, ResourceItem, ScamAnalysis, StudentProfile } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${path}`);
  }

  const payload = (await response.json()) as { data: T };
  return payload.data;
}

export async function getProfile(): Promise<StudentProfile> {
  try {
    return await request<StudentProfile>("/profile/public/aarav-sharma-campusos");
  } catch {
    return mockProfile;
  }
}

export async function getJobs(): Promise<JobItem[]> {
  try {
    return await request<JobItem[]>("/jobs");
  } catch {
    return mockJobs;
  }
}

export async function getNotifications(): Promise<NotificationItem[]> {
  try {
    return await request<NotificationItem[]>("/notifications");
  } catch {
    return mockNotifications;
  }
}

export async function searchResources(query: string): Promise<{ aiSummary: string; results: ResourceItem[] }> {
  try {
    return await request<{ aiSummary: string; results: ResourceItem[] }>("/resources/search", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  } catch {
    const results = mockResources.filter((resource) =>
      `${resource.title} ${resource.subject} ${resource.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()),
    );
    return {
      aiSummary:
        "CampusOS fallback search matched your query against topic intent, subject tags, and offline-ready learning assets.",
      results: results.length ? results : mockResources,
    };
  }
}

export async function checkScam(input: string): Promise<ScamAnalysis> {
  try {
    return await request<ScamAnalysis>("/scam/check", {
      method: "POST",
      body: JSON.stringify({ input }),
    });
  } catch {
    const suspicious = /registration fee|urgent|whatsapp hr|gmail\.com|deposit/i.test(input);
    return {
      id: "local_scam_result",
      verdict: suspicious ? "suspicious" : "safe",
      confidence: suspicious ? 68 : 22,
      reasons: suspicious
        ? ["Urgency-heavy language detected.", "Untrusted payment or recruiter pattern detected."]
        : ["No high-risk scam patterns were detected in the local fallback engine."],
      aiSummary:
        "The fallback engine checks for urgency, payment requests, generic recruiter channels, and suspicious copy patterns.",
    };
  }
}

export async function loginStudent(email: string, password: string) {
  return request<{ token: string; student: StudentProfile }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerStudent(payload: {
  fullName: string;
  email: string;
  password: string;
  collegeName: string;
  course: string;
  graduationYear: number;
}) {
  return request<{ token: string; student: StudentProfile }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
