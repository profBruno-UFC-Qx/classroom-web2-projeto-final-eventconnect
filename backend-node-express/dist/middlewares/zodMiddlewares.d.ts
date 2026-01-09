import { z } from "zod";
import { type NextFunction, type Request, type Response } from "express";
export declare const validateBody: (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateParams: (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=zodMiddlewares.d.ts.map