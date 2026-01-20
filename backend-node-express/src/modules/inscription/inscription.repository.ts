import { Inscription } from "./inscription.entity";
import { AppDataSource } from "../../config/datasource";

export const inscriptionRepository = AppDataSource.getRepository(Inscription);