import { Request, Response } from "express";
import { loginStudent, registerStudent } from "../services/auth.service";
import { sendSuccess } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerStudent(req.body);
  return sendSuccess(res, result, "Student account created successfully.", 201);
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginStudent(req.body.email, req.body.password);
  return sendSuccess(res, result, "Login successful.");
});
