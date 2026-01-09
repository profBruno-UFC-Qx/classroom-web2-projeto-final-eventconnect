"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../modules/users/user.entity");
const category_entity_1 = require("../modules/category/category.entity");
const inscription_entity_1 = require("../modules/inscription/inscription.entity");
const event_entity_1 = require("../modules/event/event.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "lxor8uqt",
    database: "projeto-web2",
    synchronize: true, // Automatically create database schema (use migrations in production)
    logging: true, // Set to true to log SQL queries
    // entities: ["src/modules/**/*.entity.ts"],
    entities: [user_entity_1.User, category_entity_1.Category, inscription_entity_1.Inscription, event_entity_1.Event]
});
//# sourceMappingURL=datasource.js.map