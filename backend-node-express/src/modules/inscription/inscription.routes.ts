import { Router } from "express";
import { InscriptionController } from "./inscription.controller";
import { validateBody, validateParams } from "../../middlewares/zodMiddlewares";
import { createInscriptionSchema } from "./inscription.schema";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { idSchema, resCollectionEntitySchema, resSingleEntitySchema } from "../../shared/schemas";
import { registry } from "../../docs/openapi";

const inscriptionRouter = Router();
const inscriptionController = new InscriptionController();

registry.registerPath({
  method: "get",
  path: "/inscricoes",
  description: "Retorna todas as inscrições",
  responses: {
    200: {
      description: "Lista de inscrições",
      content: {
        "application/json": {
          schema: resCollectionEntitySchema(createInscriptionSchema),
        },
      },
    },
  },
  tags: ["Inscrições"],
});

registry.registerPath({
  method: "post",
  path: "/inscricoes",
  description: "Cria uma nova inscrição",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createInscriptionSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Inscrição criada",
      content: {
        "application/json": {
          schema: resSingleEntitySchema(createInscriptionSchema),
        },
      },
    },
  },
  tags: ["Inscrições"],
});

registry.registerPath({
  method: "delete",
  path: "/inscricoes/{id}",
  description: "Remove uma inscrição",
  request: {
    params: idSchema,
  },
  responses: {
    204: {
      description: "Inscrição removida com sucesso",
    },
    404: {
      description: "Inscrição não encontrada",
    },
  },
  tags: ["Inscrições"],
});

inscriptionRouter.use(authMiddleware);

inscriptionRouter.post("/", validateBody(createInscriptionSchema), inscriptionController.store);
inscriptionRouter.get("/", inscriptionController.index);
inscriptionRouter.delete("/:id", validateParams(idSchema), inscriptionController.delete);

export default inscriptionRouter;
