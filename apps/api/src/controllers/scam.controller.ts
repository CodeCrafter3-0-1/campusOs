import { Request, Response } from "express";
import { analyzeScam } from "../services/scam.service";
import { sendSuccess } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const scamCheckController = asyncHandler(async (req: Request, res: Response) => {
  const result = await analyzeScam(req.body.input);
  return sendSuccess(res, result, "Scam analysis completed.");
});
