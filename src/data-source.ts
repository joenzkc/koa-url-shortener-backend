import { DataSource } from "typeorm";
import { Url } from "./entities/url.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "admin",
  password: "admin",
  database: "test",
  synchronize: true,
  logging: true,
  entities: [Url],
});
