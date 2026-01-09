import { User } from "./user.entity";
import { AppDataSource } from "../../config/datasource";

export const userRepository = AppDataSource.getRepository(User);