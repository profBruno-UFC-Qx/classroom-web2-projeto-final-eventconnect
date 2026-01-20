import { Router } from "express"
import { EventController } from "./event.controller.js"
import { validateBody, validateParams } from "../../middlewares/zodMiddlewares.js"
import { createEventSchema, updateEventSchema } from "./event.schema.js"
import { registry } from "../../docs/openapi.js"
import {
  idSchema,
  resCollectionEntitySchema,
  resSingleEntitySchema
} from "../../shared/schemas.js"
import { authMiddleware } from "../../middlewares/authMiddleware.js"
import { authAdminMiddleware } from "../../middlewares/authMiddleware.js"

const eventRouter = Router()

registry.registerPath({
      method: "get",
      path: "/eventos",
  description: "Retorna todos os eventos",
  parameters: [
    { name: "page", in: "query", schema: { type: "integer", default: 1 } },
    { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
    { name: "search", in: "query", schema: { type: "string" } },
    { name: "categoryId", in: "query", schema: { type: "string" } },
    { name: "startDate", in: "query", schema: { type: "string", format: "date-time" } },
    { name: "endDate", in: "query", schema: { type: "string", format: "date-time" } }
  ],
  responses: {
    200: {
      description: "Lista de eventos",
      content: {
        "application/json": {
          schema: resCollectionEntitySchema(createEventSchema)
        }
      }
    },
  },
  tags: ["Eventos"]
})

registry.registerPath({
      method: "post",
      path: "/eventos",
  description: "Cria um novo evento",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createEventSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: "Evento criado",
      content: {
        "application/json": {
          schema: resSingleEntitySchema(createEventSchema)
        }
      }
    },
  },
  tags: ["Eventos"]
})

registry.registerPath({
      method: "put",
      path: "/eventos/{id}",
  description: "Atualiza um evento existente",
  request: {
    params: idSchema,
    body: {
      content: {
        "application/json": {
          schema: updateEventSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: "Evento atualizado",
      content: {
        "application/json": {
          schema: resSingleEntitySchema(createEventSchema)
        }
      }
    },
    404: {
      description: "Evento não encontrado"
    }
  },
  tags: ["Eventos"]
})

registry.registerPath({
      method: "delete",
      path: "/eventos/{id}",
      description: "Remove um evento",
      request: {
        params: idSchema
      },
  responses: {
    204: {
      description: "Evento removido com sucesso"
    },
    404: {
      description: "Evento não encontrado"
    }
  },
  tags: ["Eventos"]
})

const eventController = new EventController()

eventRouter.get("/", eventController.index)

eventRouter.post(
  "/",
  authAdminMiddleware,
  validateBody(createEventSchema),
  eventController.store
)

eventRouter.put(
  "/:id",
  authAdminMiddleware,
  validateParams(idSchema),
  validateBody(updateEventSchema),
  eventController.update
)

eventRouter.delete(
  "/:id",
  authAdminMiddleware,
  validateParams(idSchema),
  eventController.delete
)


export default eventRouter
