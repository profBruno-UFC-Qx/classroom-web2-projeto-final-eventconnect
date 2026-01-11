import { Router } from 'express';
import { CategoryController } from './category.controller.js';
import { validateBody, validateParams } from '../../middlewares/zodMiddlewares.js';
import { createCategorySchema, updateCategorySchema } from './category.schema.js';
import { registry } from '../../docs/openapi.js';
import { idSchema, resCollectionEntitySchema, resSingleEntitySchema } from '../../shared/schemas.js';

const categoryRouter = Router();

registry.registerPath({
    method: 'get',
    path: '/categorias',
    description: 'Retorna todas as categorias',
    responses: {
        200: {
            description: 'Lista de categorias',
            content: {
                'application/json': {
                    schema: resCollectionEntitySchema(createCategorySchema),
                },
            },
        },
    },
    tags: ['Categorias'],
});

registry.registerPath({
    method: 'post',
    path: '/categorias',
    description: 'Cria uma nova categoria',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: createCategorySchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Categoria criada',
            content: {
                'application/json': {
                    schema: resSingleEntitySchema(createCategorySchema),
                },
            },
        },
    },
    tags: ['Categorias'],
});

registry.registerPath({
    method: 'put',
    path: '/categorias/{id}',
    description: 'Atualiza uma categoria existente',
    request: {
        params: idSchema,
        body: {
            content: {
                'application/json': {
                    schema: updateCategorySchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Categoria atualizada',
            content: {
                'application/json': {
                    schema: resSingleEntitySchema(createCategorySchema),
                },
            },
        },
        404: { description: 'Categoria não encontrada' },
    },
    tags: ['Categorias'],
});

registry.registerPath({
    method: 'delete',
    path: '/categorias/{id}',
    description: 'Remove uma categoria',
    request: { params: idSchema },
    responses: {
        204: { description: 'Categoria removida com sucesso' },
        404: { description: 'Categoria não encontrada' },
    },
    tags: ['Categorias'],
});

const categoryController = new CategoryController();

categoryRouter.get('/', categoryController.index);
categoryRouter.post('/', validateBody(createCategorySchema), categoryController.store);
categoryRouter.put('/:id', validateParams(idSchema), validateBody(updateCategorySchema), categoryController.update);
categoryRouter.delete('/:id', validateParams(idSchema), categoryController.delete);

export default categoryRouter;
