import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

// authenticate user if token is provided, but don't require it
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      (req as any).user = jwt.verify(token, JWT_SECRET) as { id: string };
    } catch {
      // invalid/expired token — continue as unauthenticated
    }
  }
  next();
};

// for routes that require authentication
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!(req as any).user) {
    res
      .status(401)
      .json({ success: false, message: "Authentication required" });
    return;
  }
  next();
};
