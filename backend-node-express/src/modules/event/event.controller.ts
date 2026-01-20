import type { Request, Response } from "express";
import { EventService } from "./event.service.js";
import { createEventSchema, updateEventSchema } from "./event.schema.js";

export class EventController {
  constructor(protected eventService: EventService = new EventService()) { }

  index = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const categoryId = req.query.categoryId as string;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const { data, total } = await this.eventService.findAll({
      page,
      limit,
      search,
      categoryId,
      startDate,
      endDate
    });

    res.json({
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  };

  show = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "ID é obrigatório" });
      return;
    }
    const evento = await this.eventService.findById(id);
    if (evento) {
      res.json({
        data: evento,
      });
    } else {
      res.status(404).json({
        message: "Evento não encontrado",
      });
    }
  };

  store = async (req: Request, res: Response) => {
    const validatedData = createEventSchema.parse(req.body);
    const evento = await this.eventService.create(validatedData);
    res.status(201).json({
      data: evento,
    });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "ID é obrigatório" });
      return;
    }
    const validatedData = updateEventSchema.parse(req.body);
    const evento = await this.eventService.update(id, validatedData);

    if (evento) {
      res.json({
        data: evento,
      });
    } else {
      res.status(404).json({
        message: "Evento não encontrado",
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "ID é obrigatório" });
      return;
    }
    try {
      await this.eventService.delete(id);
      res.status(204).json();
    } catch (error) {
      res.status(404).json({
        message: "Evento não encontrado",
      });
    }
  };
}