import "dotenv/config"
import "reflect-metadata"
import { DataSource } from "typeorm"

process.env.TZ = "UTC"

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  entities: [__dirname + "/**/entities/*{.ts,.js}"],
  migrations: [__dirname + "/**/migrations/*{.ts,.js}"]
})

export default AppDataSource
