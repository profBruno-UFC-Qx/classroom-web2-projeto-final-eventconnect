"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerError = void 0;
const metaInfos_1 = require("../shared/metaInfos");
const handlerError = (err, req, res, next) => {
    console.error(err);
    return res.status(500).json({
        success: false,
        error: {
            message: "Internal Server Error",
            details: [],
            code: "INTERNAL_ERROR"
        },
        meta: (0, metaInfos_1.metaFrom)(req)
    });
};
exports.handlerError = handlerError;
//# sourceMappingURL=errorMiddleware.js.map