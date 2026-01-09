"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resCollectionEntitySchema = exports.resSingleEntitySchema = exports.idSchema = void 0;
const zod_1 = require("zod");
exports.idSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/)
});
const resSingleEntitySchema = (schema) => {
    return zod_1.z.object({
        success: zod_1.z.boolean(),
        data: schema
    });
};
exports.resSingleEntitySchema = resSingleEntitySchema;
const resCollectionEntitySchema = (schema) => {
    return zod_1.z.object({
        success: zod_1.z.boolean(),
        data: zod_1.z.array(schema)
    });
};
exports.resCollectionEntitySchema = resCollectionEntitySchema;
//# sourceMappingURL=schemas.js.map