"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inscriptionRepository = void 0;
const inscription_entity_1 = require("./inscription.entity");
const datasource_1 = require("../../config/datasource");
exports.inscriptionRepository = datasource_1.AppDataSource.getRepository(inscription_entity_1.Inscription);
//# sourceMappingURL=inscription.repository.js.map