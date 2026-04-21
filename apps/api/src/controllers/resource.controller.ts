import { Request, Response } from "express";
import { searchResources } from "../services/resource.service";
import { sendSuccess } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const resourceSearchController = asyncHandler(async (req: Request, res: Response) => {
  const result = await searchResources(req.body.query);
  return sendSuccess(res, result, "Semantic resource results generated.");
});
