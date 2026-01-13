import { eventRepository } from "./event.repository";
import { AppDataSource } from "../../config/datasource";
import { Category } from "../category/category.entity";

export class EventService {
  async findAll() {
    return eventRepository.find({
      relations: {
        categoria: true,
        inscricoes: true,
      },
    });
  }

  async findById(id: string) {
    return eventRepository.findOne({
      where: { id },
      relations: { categoria: true, inscricoes: true },
    });
  }

  async create(data: any) {
    const categoryRepo = AppDataSource.getRepository(Category);

    const categoria = await categoryRepo.findOneBy({
      id: data.categoriaId,
    });

    if (!categoria) {
      throw new Error("Categoria não encontrada");
    }

    const event = eventRepository.create({
      nome: data.nome,
      descricao: data.descricao,
      imagem: data.imagem,
      data: data.data,
      endereco: data.endereco,
      categoria,
    });

    return eventRepository.save(event);
  }

  async update(id: string, data: any) {
    const event = await eventRepository.findOneBy({ id });

    if (!event) {
      throw new Error("Evento não encontrado");
    }

    if (data.categoriaId) {
      const categoryRepo = AppDataSource.getRepository(Category);
      const categoria = await categoryRepo.findOneBy({
        id: data.categoriaId,
      });

      if (!categoria) {
        throw new Error("Categoria não encontrada");
      }

      event.categoria = categoria;
    }

    Object.assign(event, data);

    return eventRepository.save(event);
  }

  async delete(id: string) {
    const event = await eventRepository.findOneBy({ id });

    if (!event) {
      throw new Error("Evento não encontrado");
    }

    await eventRepository.remove(event);
  }
}
