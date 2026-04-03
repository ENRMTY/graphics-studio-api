import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const { user, token } = await authService.register(email, password, name);
  res.status(201).json({ success: true, data: { user, token } });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);
  res.json({ success: true, data: { user, token } });
};

export const me = async (req: Request, res: Response) => {
  const user = await authService.getMe((req as any).user.id);
  res.json({ success: true, data: user });
};
