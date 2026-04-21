import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { careerRoadmapController, notificationsController, resumeAnalysisController, skillGapController } from "../controllers/ai.controller";
import { loginController, registerController } from "../controllers/auth.controller";
import { jobListController } from "../controllers/job.controller";
import { bookmarkController, meController, publicProfileController, updateProfileController, verifyIdController } from "../controllers/profile.controller";
import { resourceSearchController } from "../controllers/resource.controller";
import { scamCheckController } from "../controllers/scam.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  collegeName: z.string().min(2),
  course: z.string().min(2),
  graduationYear: z.coerce.number().min(2024).max(2035),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "CampusOS API is healthy.",
  });
});

router.post("/auth/register", validateBody(registerSchema), registerController);
router.post("/auth/login", validateBody(loginSchema), loginController);

router.get("/profile/me", requireAuth, meController);
router.get("/profile/public/:slug", publicProfileController);
router.patch(
  "/profile/me",
  requireAuth,
  validateBody(
    z.object({
      headline: z.string().optional(),
      bio: z.string().optional(),
      location: z.string().optional(),
      skills: z.array(z.string()).optional(),
      certifications: z.array(z.string()).optional(),
      resumeUrl: z.string().optional(),
    }),
  ),
  updateProfileController,
);
router.post("/profile/verify-id", requireAuth, upload.single("studentId"), verifyIdController);
router.post(
  "/profile/bookmark",
  requireAuth,
  validateBody(
    z.object({
      type: z.enum(["resource", "job"]),
      targetId: z.string(),
    }),
  ),
  bookmarkController,
);

router.post("/resources/search", validateBody(z.object({ query: z.string().min(3) })), resourceSearchController);
router.get("/jobs", jobListController);
router.post("/scam/check", validateBody(z.object({ input: z.string().min(8) })), scamCheckController);

router.post(
  "/ai/resume-analyze",
  validateBody(z.object({ resumeText: z.string().min(20), targetRole: z.string().min(2) })),
  resumeAnalysisController,
);
router.post(
  "/ai/skill-gap",
  validateBody(z.object({ studentSkills: z.array(z.string()), requiredSkills: z.array(z.string()) })),
  skillGapController,
);
router.post(
  "/ai/career-roadmap",
  validateBody(z.object({ goal: z.string().min(2), currentSkills: z.array(z.string()) })),
  careerRoadmapController,
);
router.get("/notifications", notificationsController);

export { router };
