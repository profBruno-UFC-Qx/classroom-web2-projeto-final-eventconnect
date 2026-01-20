import { DataSource } from "typeorm";
import { User } from "../modules/users/user.entity";
import { Category } from "../modules/category/category.entity";
import { Inscription } from "../modules/inscription/inscription.entity";
import { Event } from "../modules/event/event.entity";
import 'dotenv/config';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "senha",
    database: process.env.DB_NAME || "event_connector",
    synchronize: true,
    logging: true,
    // entities: ["src/modules/**/*.entity.ts"],
    entities: [User, Category, Inscription, Event]
});