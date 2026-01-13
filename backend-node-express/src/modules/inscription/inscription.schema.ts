import { z } from "zod";

export const createInscriptionSchema = z.object({
  eventId: z
    .string()
    .uuid("ID do evento deve ser um UUID válido"),
});

export type CreateInscriptionBody = z.infer<typeof createInscriptionSchema>;

export type CreateInscriptionServiceDTO = {
  userId: string;
  eventId: string;
};
