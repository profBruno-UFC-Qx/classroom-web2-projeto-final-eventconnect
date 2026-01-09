"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const openapi_js_1 = require("./docs/openapi.js");
const errorMiddleware_js_1 = require("./middlewares/errorMiddleware.js");
const datasource_js_1 = require("./config/datasource.js");
const user_routes_js_1 = __importDefault(require("./modules/users/user.routes.js"));
const app = (0, express_1.default)();
const PORT = 3001;
app.use((0, morgan_1.default)('tiny'));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
datasource_js_1.AppDataSource.initialize()
    .then(() => console.log("📦 Database connected"))
    .catch((err) => console.error("❌ Error connecting database:", err));
const openApiDocs = (0, openapi_js_1.buildOpenAPIDocument)();
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openApiDocs));
app.use('/users', user_routes_js_1.default);
app.get('/', (req, res) => {
    res.send({ message: 'API rodando com sucesso!' });
});
app.use(errorMiddleware_js_1.handlerError);
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map