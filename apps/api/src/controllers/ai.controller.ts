import { Request, Response } from "express";
import { analyzeResume, analyzeSkillGap, generateCareerRoadmap } from "../services/resume.service";
import { listNotifications } from "../services/notification.service";
import { sendSuccess } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const resumeAnalysisController = asyncHandler(async (req: Request, res: Response) => {
  const result = await analyzeResume(req.body.resumeText, req.body.targetRole);
  return sendSuccess(res, result, "Resume analysis completed.");
});

export const skillGapController = asyncHandler(async (req: Request, res: Response) => {
  const result = analyzeSkillGap(req.body.studentSkills, req.body.requiredSkills);
  return sendSuccess(res, result, "Skill gap analyzed.");
});

export const careerRoadmapController = asyncHandler(async (req: Request, res: Response) => {
  const result = await generateCareerRoadmap(req.body.goal, req.body.currentSkills);
  return sendSuccess(res, result, "Career roadmap generated.");
});

export const notificationsController = asyncHandler(async (_req: Request, res: Response) => {
  const result = listNotifications();
  return sendSuccess(res, result);
});
