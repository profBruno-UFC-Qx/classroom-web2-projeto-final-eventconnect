"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateBody = void 0;
const zod_1 = require("zod");
const metaInfos_js_1 = require("../shared/metaInfos.js");
const validateBody = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: zodErrorToResponse(err, "VALIDATION ERROR"),
                meta: (0, metaInfos_js_1.metaFrom)(req),
            });
        }
    }
};
exports.validateBody = validateBody;
const validateParams = (schema) => (req, res, next) => {
    try {
        schema.parse(req.params);
        next();
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: zodErrorToResponse(err, "VALIDATION ERROR"),
                meta: (0, metaInfos_js_1.metaFrom)(req),
            });
        }
    }
};
exports.validateParams = validateParams;
function zodErrorToResponse(err, code) {
    return {
        error: {
            message: "Validation failed",
            details: err.issues.map((issue) => ({
                field: issue.path.length == 1 ? issue.path[0] : issue.path,
                message: issue.message,
            })),
            code,
        },
    };
}
//# sourceMappingURL=zodMiddlewares.js.map