import { z } from 'zod';

export const createEventSchema = z.object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    descricao: z.string().optional(),
    imagem: z.string().url("A imagem deve ser uma URL válida"),
    data: z.coerce.date(),
    endereco: z.string(),
    categoriaId: z.string().uuid("ID da categoria deve ser um UUID válido"),
});

export const updateEventSchema = createEventSchema.partial();

export type EventType = z.infer<typeof createEventSchema>;