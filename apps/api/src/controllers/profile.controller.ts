import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  getShareableProfile,
  getStudentProfile,
  submitIdVerification,
  toggleBookmark,
  updateStudentProfile,
} from "../services/profile.service";
import { sendSuccess } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const meController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const student = getStudentProfile(req.user!.studentId);
  return sendSuccess(res, student);
});

export const publicProfileController = asyncHandler(async (req: Request, res: Response) => {
  const student = getShareableProfile(String(req.params.slug));
  return sendSuccess(res, student);
});

export const updateProfileController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const student = updateStudentProfile(req.user!.studentId, req.body);
  return sendSuccess(res, student, "Profile updated successfully.");
});

export const verifyIdController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const student = submitIdVerification(req.user!.studentId, req.file?.originalname);
  return sendSuccess(res, student, "Student identity verified.");
});

export const bookmarkController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const student = toggleBookmark(req.user!.studentId, req.body);
  return sendSuccess(res, student, "Bookmark updated.");
});
