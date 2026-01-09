"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_aqui";
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Token não fornecido'
        });
    }
    // Formato esperado: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ success: false, message: 'Token malformatado' });
    }
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ success: false, message: 'Token deve ser do tipo Bearer' });
    }
    try {
        // Valida o Token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Injeta o ID no request para o Controller usar
        req.user = {
            id: decoded.id,
        };
        return next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido ou expirado'
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map