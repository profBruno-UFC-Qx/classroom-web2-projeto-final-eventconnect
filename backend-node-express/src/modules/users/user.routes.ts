import { Router } from "express";
import { getMe, login, register } from "./user.controller.js";
import { registry } from "../../docs/openapi.js";
import { resSingleEntitySchema } from "../../shared/schemas.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { UserPublicSchema, LoginSchema, RegisterBodySchema } from "./user.schema.js";

export const authRouter = Router();
const userRouter = Router();

registry.registerPath({
  method: "post",
  path: "/auth/register",
  description: "Cadastro de usuário",
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: RegisterBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Usuário cadastrado",
      content: {
        "application/json": {
          schema: resSingleEntitySchema(UserPublicSchema),
        },
      },
    },
    400: { description: "Erro de validação" },
  },
  tags: ["Auth"],
});

registry.registerPath({
  method: "post",
  path: "/auth/login",
  description: "Login do usuário (retorna JWT)",
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: LoginSchema,
        },
      },
    },
  },
  responses: {
    200: { description: "Login OK" },
    401: { description: "Credenciais inválidas" },
    400: { description: "Erro de validação" },
  },
  tags: ["Auth"],
});

authRouter.post("/register", register);
authRouter.post("/login", login);

// /users/me
registry.registerPath({
  method: "get",
  path: "/users/me",
  description: "Retorna o perfil do usuário autenticado",
  security: [{ bearerAuth: [] }],
  responses: {  
    200: {
      description: "Dados do usuário logado",
      content: {
        "application/json": {
          schema: resSingleEntitySchema(UserPublicSchema),
        }
      }
    },
    401: {
      description: "Token inválido ou ausente",
    }
  },
  tags: ["Users"]
});

userRouter.get("/me", authMiddleware, getMe);

export default userRouter;