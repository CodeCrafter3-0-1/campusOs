import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

export async function connectDatabase() {
  if (!env.MONGO_URI) {
    logger.info("MONGO_URI not set. Running CampusOS API with in-memory seed data.");
    return;
  }

  await mongoose.connect(env.MONGO_URI);
  logger.info("Connected to MongoDB.");
}
