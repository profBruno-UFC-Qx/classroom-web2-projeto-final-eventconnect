"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const zod_1 = require("zod");
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive().optional(),
    username: zod_1.z
        .string()
        .min(3, 'Username deve ter no mínimo 3 caracteres'),
    email: zod_1.z
        .string()
        .email('Email inválido')
        .min(6, 'Email deve ter no mínimo 6 caracteres'),
    password: zod_1.z
        .string()
        .min(6, 'A senha deve ter no mínimo 6 caracteres')
        .optional(),
    provider: zod_1.z.string().default('local'),
    confirmed: zod_1.z.boolean().default(false),
    blocked: zod_1.z.boolean().default(false),
    roleId: zod_1.z.number().int().positive().optional(),
    createdAt: zod_1.z.coerce.date().optional(),
    updatedAt: zod_1.z.coerce.date().optional(),
});
//# sourceMappingURL=user.schema.js.map