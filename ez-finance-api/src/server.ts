import { AppDataSource } from "./config/data-source";
import { env } from "./config/env";
import app from "./app";

const startServer = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();

    app.listen(env.port, () => {
      console.log(`EZ Finance API is running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start EZ Finance API", error);
    process.exit(1);
  }
};

void startServer();
