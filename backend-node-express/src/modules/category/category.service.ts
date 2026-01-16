import { categoryRepository } from './category.repository';

export class CategoryService {
    async findAll(page: number = 1, limit: number = 10) {
        const [data, total] = await categoryRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' }
        });

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async findById(id: string) {
        return categoryRepository.findOne({ where: { id } });
    }

    async create(data: any) {
        const categoria = categoryRepository.create({ nome: data.nome });
        return categoryRepository.save(categoria);
    }

    async update(id: string, data: any) {
        const categoria = await categoryRepository.findOneBy({ id });

        if (!categoria) {
            throw new Error('Categoria não encontrada');
        }

        Object.assign(categoria, data);
        return categoryRepository.save(categoria);
    }

    async delete(id: string) {
        const categoria = await categoryRepository.findOneBy({ id });

        if (!categoria) {
            throw new Error('Categoria não encontrada');
        }

        await categoryRepository.remove(categoria);
    }
}
