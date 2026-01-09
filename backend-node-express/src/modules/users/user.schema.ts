import { z } from 'zod';

export const UserSchema = z.object({
    id: z.number().int().positive().optional(),
    username: z
        .string()
        .min(3, 'Username deve ter no mínimo 3 caracteres'),
    email: z
        .string()
        .email('Email inválido')
        .min(6, 'Email deve ter no mínimo 6 caracteres'),
    password: z
        .string()
        .min(6, 'A senha deve ter no mínimo 6 caracteres')
        .optional(), 
    provider: z.string().default('local'),
    confirmed: z.boolean().default(false),
    blocked: z.boolean().default(false),
    roleId: z.number().int().positive().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

export type UserType = z.infer<typeof UserSchema>;