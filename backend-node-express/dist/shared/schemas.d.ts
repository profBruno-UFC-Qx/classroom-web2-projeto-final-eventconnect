import { z, ZodType } from 'zod';
export declare const idSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const resSingleEntitySchema: (schema: ZodType) => z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
}, z.core.$strip>;
export declare const resCollectionEntitySchema: (schema: ZodType) => z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodArray<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
}, z.core.$strip>;
//# sourceMappingURL=schemas.d.ts.map