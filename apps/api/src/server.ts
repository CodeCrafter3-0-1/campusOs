import { app } from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";
import { logger } from "./utils/logger";

async function bootstrap() {
  await connectDatabase();

  app.listen(env.PORT, () => {
    logger.info(`CampusOS API running on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  logger.error("Failed to bootstrap server.", error);
  process.exit(1);
});
