import { User } from "./user.entity.js";
import { AppDataSource } from "../../config/datasource";

export const userRepository = AppDataSource.getRepository(User);