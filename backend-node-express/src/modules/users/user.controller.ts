import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";

interface AuthRequest extends Request {
  user: {
    id: number;
  };
}

const userService = new UserService();

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    
    const userId = authReq.user.id; 
    const user = await userService.getMe(userId);
    
    return res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    next(error); 
  }
};