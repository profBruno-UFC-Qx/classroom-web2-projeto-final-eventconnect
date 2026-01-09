"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registry = void 0;
exports.buildOpenAPIDocument = buildOpenAPIDocument;
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
exports.registry = new zod_to_openapi_1.OpenAPIRegistry();
function buildOpenAPIDocument() {
    const generator = new zod_to_openapi_1.OpenApiGeneratorV3(exports.registry.definitions);
    const doc = generator.generateDocument({
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'EventConnect API',
            description: 'API para gerenciamento de eventos e inscrições',
        },
        servers: [{ url: 'http://localhost:3000' }],
    });
    return doc;
}
//# sourceMappingURL=openapi.js.map