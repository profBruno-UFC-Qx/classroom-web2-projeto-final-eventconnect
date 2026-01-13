import { inscriptionRepository } from "./inscription.repository";
import { AppDataSource } from "../../config/datasource";
import { User } from "../users/user.entity";
import { Event } from "../event/event.entity";
import { CreateInscriptionServiceDTO } from "./inscription.schema";

export class InscriptionService {
    async create({ userId, eventId }: CreateInscriptionServiceDTO) {
        const userRepo = AppDataSource.getRepository(User);
        const eventRepo = AppDataSource.getRepository(Event);

        const user = await userRepo.findOneBy({ id: userId });
        if (!user) throw new Error("Usuário não encontrado");

        const event = await eventRepo.findOneBy({ id: eventId });
        if (!event) throw new Error("Evento não encontrado");

        const exists = await inscriptionRepository.findOne({
            where: {
                user: { id: userId },
                evento: { id: eventId },
            },
        });

        if (exists) throw new Error("Usuário já inscrito neste evento");

        return inscriptionRepository.save(
            inscriptionRepository.create({ user, evento: event })
        );
    }

    async findAll(filters: { userId: string; eventId?: string | undefined }) {
        const where: any = {
            user: { id: filters.userId },
        };

        if (filters.eventId) {
            where.evento = { id: filters.eventId };
        }

        return inscriptionRepository.find({
            where,
            relations: ["user", "evento"],
        });
    }

    async delete(inscriptionId: string, userId: string) {
        const inscription = await inscriptionRepository.findOne({
            where: {
                id: inscriptionId,
                user: { id: userId },
            },
        });

        if (!inscription) {
            throw new Error("Inscrição não encontrada");
        }

        await inscriptionRepository.remove(inscription);
    }
}
