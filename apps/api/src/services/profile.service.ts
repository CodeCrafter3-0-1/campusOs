import { dataStore } from "../repositories/data-store";
import { HttpError } from "../utils/http-error";
import { createId } from "../utils/id";

export function getStudentProfile(studentId: string) {
  const student = dataStore.findStudentById(studentId);

  if (!student) {
    throw new HttpError(404, "Student profile not found.");
  }

  return student;
}

export function getShareableProfile(slug: string) {
  const student = dataStore.findStudentBySlug(slug);

  if (!student) {
    throw new HttpError(404, "Public student profile not found.");
  }

  return student;
}

export function updateStudentProfile(
  studentId: string,
  partial: Partial<{
    headline: string;
    bio: string;
    location: string;
    skills: string[];
    certifications: string[];
    resumeUrl: string;
  }>,
) {
  const student = dataStore.updateStudent(studentId, partial);

  if (!student) {
    throw new HttpError(404, "Student profile not found.");
  }

  return student;
}

export function submitIdVerification(studentId: string, fileName?: string) {
  const student = dataStore.findStudentById(studentId);

  if (!student) {
    throw new HttpError(404, "Student profile not found.");
  }

  const updatedStudent = dataStore.updateStudent(studentId, {
    verified: true,
    verificationStatus: "verified",
    verificationMethod: "id-upload",
    badge: "Verified Student",
  });

  if (updatedStudent) {
    dataStore.addNotification({
      id: createId("notif"),
      title: "Identity upgraded",
      body: `Your ID document ${fileName ?? "upload"} was approved and your trust badge is now active.`,
      type: "success",
      createdAt: new Date().toISOString(),
      read: false,
    });
  }

  return updatedStudent;
}

export function toggleBookmark(studentId: string, target: { type: "resource" | "job"; targetId: string }) {
  const student = dataStore.findStudentById(studentId);

  if (!student) {
    throw new HttpError(404, "Student profile not found.");
  }

  const key = target.type === "resource" ? "bookmarkedResourceIds" : "bookmarkedJobIds";
  const current = new Set(student[key]);

  if (current.has(target.targetId)) {
    current.delete(target.targetId);
  } else {
    current.add(target.targetId);
  }

  return dataStore.updateStudent(studentId, {
    [key]: [...current],
  });
}
