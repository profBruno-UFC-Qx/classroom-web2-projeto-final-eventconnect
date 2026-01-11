import { z } from 'zod';

export const createCategorySchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(1, 'O nome da categoria é obrigatório'),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CategoryType = z.infer<typeof createCategorySchema>;
