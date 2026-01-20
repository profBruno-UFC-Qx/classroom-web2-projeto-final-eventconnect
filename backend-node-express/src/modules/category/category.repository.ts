import { Category } from "./category.entity";
import { AppDataSource } from "../../config/datasource";

export const categoryRepository = AppDataSource.getRepository(Category);