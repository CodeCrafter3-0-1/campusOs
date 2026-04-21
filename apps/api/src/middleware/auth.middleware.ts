import { NextFunction, Request, Response } from "express";
import { dataStore } from "../repositories/data-store";
import { verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: {
    studentId: string;
    email: string;
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.replace("Bearer ", "") : "";

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required.",
    });
  }

  try {
    const payload = verifyToken(token);
    const student = dataStore.findStudentById(payload.studentId);

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid session.",
      });
    }

    req.user = payload;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}
