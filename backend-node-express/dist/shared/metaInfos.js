"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaFrom = metaFrom;
function metaFrom(req) {
    return {
        path: req.originalUrl,
        timestamp: new Date().toISOString()
    };
}
//# sourceMappingURL=metaInfos.js.map