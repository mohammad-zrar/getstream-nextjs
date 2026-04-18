import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/database/entities/User";
import { Room } from "@/database/entities/Room";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true, // ⚠️ set to false in production, use migrations
  logging: false,
  entities: [User, Room],
});

let initialized = false;

export async function getDataSource(): Promise<DataSource> {
  if (!initialized) {
    await AppDataSource.initialize();
    initialized = true;
  }
  return AppDataSource;
}
