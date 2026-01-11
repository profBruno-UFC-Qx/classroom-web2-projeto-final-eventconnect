import type { Request, Response } from 'express';
import { CategoryService } from './category.service.js';
import { createCategorySchema, updateCategorySchema } from './category.schema.js';

export class CategoryController {
    constructor(protected categoryService: CategoryService = new CategoryService()) { }

    index = async (req: Request, res: Response) => {
        const categorias = await this.categoryService.findAll();
        res.json({ data: categorias });
    };

    show = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const categoria = await this.categoryService.findById(id);
        if (categoria) {
            res.json({ data: categoria });
        } else {
            res.status(404).json({ message: 'Categoria não encontrada' });
        }
    };

    store = async (req: Request, res: Response) => {
        const validated = createCategorySchema.parse(req.body.data ?? req.body);
        const categoria = await this.categoryService.create(validated);
        res.status(201).json({ data: categoria });
    };

    update = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const validated = updateCategorySchema.parse(req.body.data ?? req.body);
        try {
            const categoria = await this.categoryService.update(id, validated);
            res.json({ data: categoria });
        } catch (error) {
            res.status(404).json({ message: 'Categoria não encontrada' });
        }
    };

    delete = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        try {
            await this.categoryService.delete(id);
            res.status(204).json();
        } catch (error) {
            res.status(404).json({ message: 'Categoria não encontrada' });
        }
    };
}
