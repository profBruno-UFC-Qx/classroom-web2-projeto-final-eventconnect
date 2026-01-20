import { Event } from "./event.entity";
import { AppDataSource } from "../../config/datasource";

export const eventRepository = AppDataSource.getRepository(Event);