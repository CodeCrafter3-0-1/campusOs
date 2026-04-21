import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../utils/http-error";
import { logger } from "../utils/logger";

export function notFoundHandler(_req: Request, res: Response) {
  return res.status(404).json({
    success: false,
    message: "Route not found.",
  });
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  logger.error(error.message);

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      issues: error.flatten(),
    });
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
}
