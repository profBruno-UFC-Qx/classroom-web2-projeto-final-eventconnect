import { NextFunction, Request, Response } from "express";
import { userRepository } from "../modules/users/user.repository.js";

interface AuthRequest extends Request {
  user?: { id: number };
}

export const requireAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.user?.id) {
      return res.status(401).json({ success: false, message: "Não autenticado" });
    }

    const user = await userRepository.findOne({ where: { id: authReq.user.id } });

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
  } catch (err) {
    return next(err);
  }
};