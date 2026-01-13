import { z, ZodType } from 'zod'
import { Request } from "express";

export const idSchema = z.object({
  id: z.string().uuid({ message: "ID deve ser um UUID válido" })
})

export const documentIdSchema = z.object({
  documentId: z.string().regex(/^\d+$/)
})

export const resSingleEntitySchema = (schema: ZodType) => {
  return z.object({
    success: z.boolean(),
    data: schema
  })
}

export const resCollectionEntitySchema = (schema: ZodType) => {
  return z.object({
    success: z.boolean(),
    data: z.array(schema)
  })
}
export interface AuthRequest extends Request {
  user: {
    id: string;
  };
}
