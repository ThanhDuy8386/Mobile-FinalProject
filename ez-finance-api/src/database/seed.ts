import "reflect-metadata";
import bcrypt from "bcrypt";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { AuthService } from "../services/auth.service";

const DEMO_EMAIL = "demo@ezfinance.com";
const DEMO_PASSWORD = "123456";
const DEMO_FULL_NAME = "Demo User";
const SALT_ROUNDS = 10;

const seed = async (): Promise<void> => {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);
  let demoUser = await userRepository.findOne({
    where: {
      email: DEMO_EMAIL
    }
  });

  if (!demoUser) {
    demoUser = userRepository.create({
      email: DEMO_EMAIL,
      fullName: DEMO_FULL_NAME,
      passwordHash: await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS)
    });
    demoUser = await userRepository.save(demoUser);
  }

  await new AuthService().createDefaultCategoriesForUser(demoUser.id);
};

seed()
  .then(async () => {
    console.log("Seed completed successfully");
    await AppDataSource.destroy();
  })
  .catch(async (error) => {
    console.error("Seed failed", error);

    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }

    process.exit(1);
  });
