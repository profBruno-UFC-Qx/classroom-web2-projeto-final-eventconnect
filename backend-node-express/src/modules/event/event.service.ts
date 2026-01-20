import { eventRepository } from "./event.repository";
import { AppDataSource } from "../../config/datasource";
import { Category } from "../category/category.entity";
import { Between, ILike, LessThanOrEqual, MoreThanOrEqual, type FindOptionsWhere } from "typeorm";
import { Event } from "./event.entity";

interface FindAllParams {
  page: number;
  limit: number;
  search?: string | undefined;
  categoryId?: string | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
}

export class EventService {
  async findAll({ page, limit, search, categoryId, startDate, endDate }: FindAllParams) {
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Event> = {};

    if (categoryId) {
      where.categoria = { id: categoryId };
    }

    if (startDate && !Number.isNaN(startDate.getTime())) {
      if (endDate && !Number.isNaN(endDate.getTime())) {
        where.data = Between(startDate, endDate);
      } else {
        where.data = MoreThanOrEqual(startDate);
      }
    } else if (endDate && !Number.isNaN(endDate.getTime())) {
      where.data = LessThanOrEqual(endDate);
    }

    let finalWhere: FindOptionsWhere<Event> | FindOptionsWhere<Event>[] = where;
    
    if (search) {
      const searchLike = ILike(`%${search}%`);
      finalWhere = [
        { ...where, nome: searchLike },
        { ...where, descricao: searchLike },
      ];
    }

    const [data, total] = await eventRepository.findAndCount({
      relations: {
        categoria: true,
        inscricoes: true,
      },
      where: finalWhere,
      skip,
      take: limit,
      order: {
        data: "ASC"
      }
    });
    return { data, total };
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
