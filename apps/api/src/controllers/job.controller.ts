import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { dataStore } from "../repositories/data-store";
import { listJobs } from "../services/job.service";
import { sendSuccess } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const jobListController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const student = req.user ? dataStore.findStudentById(req.user.studentId) : undefined;
  const jobs = listJobs(student);
  return sendSuccess(res, jobs);
});
