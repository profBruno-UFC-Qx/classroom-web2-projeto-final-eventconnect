"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRepository = void 0;
const event_entity_1 = require("./event.entity");
const datasource_1 = require("../../config/datasource");
exports.eventRepository = datasource_1.AppDataSource.getRepository(event_entity_1.Event);
//# sourceMappingURL=event.repository.js.map