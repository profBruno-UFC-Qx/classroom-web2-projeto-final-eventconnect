"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRepository = void 0;
const category_entity_1 = require("./category.entity");
const datasource_1 = require("../../config/datasource");
exports.categoryRepository = datasource_1.AppDataSource.getRepository(category_entity_1.Category);
//# sourceMappingURL=category.repository.js.map