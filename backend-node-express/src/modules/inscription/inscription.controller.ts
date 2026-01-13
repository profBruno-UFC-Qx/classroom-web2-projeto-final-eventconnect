import { Request, Response } from "express";
import { InscriptionService } from "./inscription.service";
import { createInscriptionSchema } from "./inscription.schema";
import { AuthRequest } from "../../shared/schemas";

export class InscriptionController {
    constructor(
        private inscriptionService: InscriptionService = new InscriptionService()
    ) { }

    store = async (req: Request, res: Response) => {
        try {
            const { eventId } = createInscriptionSchema.parse(req.body);

            const inscription = await this.inscriptionService.create({
                userId: (req as AuthRequest).user.id,
                eventId,
            });

            res.status(201).json({ data: inscription });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    index = async (req: Request, res: Response) => {
        try {
            const eventId = req.query.eventId
                ? String(req.query.eventId)
                : undefined;

            const inscriptions = await this.inscriptionService.findAll({
                userId: (req as AuthRequest).user.id,
                eventId,
            });

            res.json({ data: inscriptions });
        } catch {
            res.status(500).json({ message: "Erro ao buscar inscrições" });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ message: "ID é obrigatório" });
                return;
            }
            await this.inscriptionService.delete(id, (req as AuthRequest).user.id);

            res.status(204).send();
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };
}
