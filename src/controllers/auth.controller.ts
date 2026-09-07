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

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (typeof email !== "string" || !email.trim()) {
    res.status(400).json({ success: false, message: "Email is required" });
    return;
  }

  await authService.requestPasswordReset(email);
  res.json({ success: true, message: "If an account exists, an OTP was sent" });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  if (
    typeof email !== "string" ||
    typeof otp !== "string" ||
    typeof newPassword !== "string"
  ) {
    res.status(400).json({
      success: false,
      message: "Email, OTP and new password are required",
    });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
    return;
  }

  await authService.resetPassword(email, otp, newPassword);
  res.json({ success: true, message: "Password reset successfully" });
};
