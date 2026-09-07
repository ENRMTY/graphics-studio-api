import jwt from "jsonwebtoken";
import { HttpError } from "../middleware/errorHandler";
import User from "../models/User";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "";
const OTP_TTL_MS = 10 * 60 * 1000;

const passwordResetOtps = new Map<string, { otp: string; expiresAt: number }>();

export const authService = {
  async register(email: string, password: string, name?: string) {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new HttpError(400, "Email already registered");
    }

    const user = await User.create({
      email,
      password,
      name: name || email.split("@")[0],
    });
    return {
      user,
      token: jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "30d" }),
    };
  },

  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpError(401, "Invalid credentials");
    }
    return {
      user,
      token: jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "30d" }),
    };
  },

  async getMe(userId: string) {
    const user = await User.findByPk(userId, {
      attributes: ["id", "email", "name"],
    });
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  },

  async requestPasswordReset(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      passwordResetOtps.set(normalizedEmail, {
        otp,
        expiresAt: Date.now() + OTP_TTL_MS,
      });
      console.log(`[Auth]: Password reset OTP for ${normalizedEmail}: ${otp}`);
    }
  },

  async resetPassword(email: string, otp: string, newPassword: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const reset = passwordResetOtps.get(normalizedEmail);

    if (!reset || reset.expiresAt < Date.now() || reset.otp !== otp.trim()) {
      throw new HttpError(400, "Invalid or expired OTP");
    }

    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      throw new HttpError(400, "Invalid or expired OTP");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    passwordResetOtps.delete(normalizedEmail);
  },
};
