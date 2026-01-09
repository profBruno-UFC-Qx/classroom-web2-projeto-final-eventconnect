import { Router } from "express";
import { getMe } from "./user.controller.js";
import { registry } from "../../docs/openapi.js";
import { resSingleEntitySchema } from "../../shared/schemas.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { UserSchema } from "./user.schema.js";

const userRouter = Router();

registry.registerPath({
  method: "get",
  path: "/users/me",
  description: "Retorna o perfil do usuário autenticado (Padrão Strapi)",
  security: [{ bearerAuth: [] }],
  responses: {  
    200: {
      description: "Dados do usuário logado",
      content: {
        "application/json": {
          schema: resSingleEntitySchema(UserSchema)
        }
      }
    },
    401: {
      description: "Token inválido ou ausente"
    }
  },
  tags: ["Users"]
});


userRouter.get('/me', authMiddleware, getMe);

export default userRouter;