import { categoryRepository } from './category.repository';

export class CategoryService {
    async findAll() {
        return categoryRepository.find();
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
