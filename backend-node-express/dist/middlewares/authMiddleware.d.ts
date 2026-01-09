import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: {
        id: number;
    };
}
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export {};
//# sourceMappingURL=authMiddleware.d.ts.map