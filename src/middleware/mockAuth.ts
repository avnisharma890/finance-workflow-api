import { Request, Response, NextFunction } from "express";

export function mockAuth(req: Request, res: Response, next: NextFunction) {
  (req as any).user = { id: "661f0c2f8b3e2c0012345678" };
  next();
}