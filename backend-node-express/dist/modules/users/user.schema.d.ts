import { z } from 'zod';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodOptional<z.ZodString>;
    provider: z.ZodDefault<z.ZodString>;
    confirmed: z.ZodDefault<z.ZodBoolean>;
    blocked: z.ZodDefault<z.ZodBoolean>;
    roleId: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    updatedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type UserType = z.infer<typeof UserSchema>;
//# sourceMappingURL=user.schema.d.ts.map