import { z } from 'zod';

export const UserSchema = z.object({
    id: z.uuid().optional(),
    username: z
        .string()
        .min(3, 'Username deve ter no mínimo 3 caracteres'),
    email: z
        .email('Email inválido'),
    password: z
        .string()
        .min(6, 'A senha deve ter no mínimo 6 caracteres'),
    provider: z.string().default('local'),
    confirmed: z.boolean().default(false),
    blocked: z.boolean().default(false),
    role: z.enum(["user", "Admin"]).default("user"),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

export const UserPublicSchema = UserSchema.omit({ password: true });

export const RegisterBodySchema = UserSchema.pick({
  username: true,
  email: true,
  password: true,
});


export const LoginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha é obrigatória"),
});

export type UserType = z.infer<typeof UserSchema>;
export type UserPublicType = z.infer<typeof UserPublicSchema>;
export type RegisterType = z.infer<typeof RegisterBodySchema>;
export type LoginType = z.infer<typeof LoginSchema>;