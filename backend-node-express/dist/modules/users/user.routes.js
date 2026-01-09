"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_js_1 = require("./user.controller.js");
const openapi_js_1 = require("../../docs/openapi.js");
const schemas_js_1 = require("../../shared/schemas.js");
const authMiddleware_js_1 = require("../../middlewares/authMiddleware.js");
const user_schema_js_1 = require("./user.schema.js");
const userRouter = (0, express_1.Router)();
openapi_js_1.registry.registerPath({
    method: "get",
    path: "/users/me",
    description: "Retorna o perfil do usuário autenticado (Padrão Strapi)",
    security: [{ bearerAuth: [] }], // Indica que precisa de token no Swagger
    responses: {
        200: {
            description: "Dados do usuário logado",
            content: {
                "application/json": {
                    schema: (0, schemas_js_1.resSingleEntitySchema)(user_schema_js_1.UserSchema)
                }
            }
        },
        401: {
            description: "Token inválido ou ausente"
        }
    },
    tags: ["Users"]
});
// A única rota ativa
userRouter.get('/me', authMiddleware_js_1.authMiddleware, user_controller_js_1.getMe);
exports.default = userRouter;
//# sourceMappingURL=user.routes.js.map