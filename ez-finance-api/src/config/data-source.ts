import "reflect-metadata";
import path from "path";
import { DataSource } from "typeorm";
import { env } from "./env";
import { Budget } from "../entities/Budget";
import { Category } from "../entities/Category";
import { Transaction } from "../entities/Transaction";
import { User } from "../entities/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: false,
  logging: env.nodeEnv === "development" ? ["error", "warn"] : ["error"],
  entities: [User, Category, Transaction, Budget],
  migrations: [path.join(__dirname, "../database/migrations/*.{ts,js}")]
});
