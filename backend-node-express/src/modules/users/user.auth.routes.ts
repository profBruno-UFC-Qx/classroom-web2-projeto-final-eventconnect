import { Router } from "express";
import { registry } from "../../docs/openapi.js";
import { login, register } from "./user.controller.js";
import { resSingleEntitySchema } from "../../shared/schemas.js";
import { UserPublicSchema, UserSchema, LoginSchema } from "./user.schema.js";

const authRouter = Router();

const RegisterBodySchema = UserSchema.pick({
  username: true,
  email: true,
  password: true,
});

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

export default authRouter;