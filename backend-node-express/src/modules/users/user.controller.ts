import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";
import { UserSchema, LoginSchema } from "./user.schema.js";

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

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = UserSchema.pick({ username: true, email: true, password: true }).parse(req.body);
    const result = await userService.register(input);

    return res.status(201).json({
      success: true,
      data: result, // { jwt, user }
    });
  } catch (error: any) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = LoginSchema.parse(req.body);
    const result = await userService.login(input);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};