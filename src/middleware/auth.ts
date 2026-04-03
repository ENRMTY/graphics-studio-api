import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      (req as any).user = jwt.verify(token, JWT_SECRET);
    } catch {
        // ignore invalid token, continue without user
    }
  }
  next();
};
