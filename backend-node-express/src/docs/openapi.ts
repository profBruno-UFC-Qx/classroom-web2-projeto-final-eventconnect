import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from 'zod';

export const registry = new OpenAPIRegistry();

extendZodWithOpenApi(z);

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

export function buildOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  const doc = generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'EventConnect API',
      description: 'API para gerenciamento de eventos e inscrições',
    },
    servers: [{ url: 'http://localhost:3001' }],
    security: [{ bearerAuth: [] }],
  })
  return doc;
}