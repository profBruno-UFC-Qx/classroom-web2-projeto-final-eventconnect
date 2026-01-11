import type { Request, Response } from "express";
import { EventService } from "./event.service.js";
import { createEventSchema, updateEventSchema } from "./event.schema.js";

export class EventController {
  constructor(protected eventService: EventService = new EventService()) { }

  index = async (req: Request, res: Response) => {
    const eventos = await this.eventService.findAll();
    res.json({
      data: eventos,
    });
  };

  show = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
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
    const id = Number(req.params.id);
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
    const id = Number(req.params.id);
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