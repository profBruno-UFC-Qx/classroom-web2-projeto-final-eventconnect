"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const user_entity_1 = require("./user.entity");
const datasource_1 = require("../../config/datasource");
exports.userRepository = datasource_1.AppDataSource.getRepository(user_entity_1.User);
//# sourceMappingURL=user.repository.js.map