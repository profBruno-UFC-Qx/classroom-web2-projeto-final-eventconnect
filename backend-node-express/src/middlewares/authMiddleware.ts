import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: {
        id: number;
    };
}

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Token não fornecido'
        });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({ success: false, message: 'Token malformatado' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme as any)) {
        return res.status(401).json({ success: false, message: 'Token deve ser do tipo Bearer' });
    }

    try {
        const decoded = jwt.verify(token as string, JWT_SECRET) as unknown as { id: number };

        req.user = {
            id: decoded.id,
        };

        return next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido ou expirado'
        });
    }
};