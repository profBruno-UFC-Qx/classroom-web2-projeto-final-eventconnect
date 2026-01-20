import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userRepository } from '../modules/users/user.repository.js';

interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

const JWT_SECRET = process.env.JWT_SECRET || "chave_secreta";

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
        const decoded = jwt.verify(token as string, JWT_SECRET) as unknown as { id: string };

        req.user = {
            id: String(decoded.id),
        };

        return next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido ou expirado'
        });
    }
};

export const authAdminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    authMiddleware(req, res, async (err?: any) => {
        if (err) return next(err);

        try {
            if (!req.user?.id) {
                return res.status(401).json({ success: false, message: "Não autenticado" });
            }

            const user = await userRepository.findOne({ where: { id: req.user.id } });

            if (!user) {
                return res.status(401).json({ success: false, message: "Não autenticado" });
            }

            if (user.blocked) {
                return res.status(403).json({ success: false, message: "Usuário bloqueado" });
            }

            if (user.role !== "Admin") {
                return res.status(403).json({ success: false, message: "Acesso restrito (Admin)" });
            }

            return next();
        } catch (e) {
            return next(e);
        }
    });
};