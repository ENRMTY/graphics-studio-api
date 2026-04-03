import jwt from "jsonwebtoken";
import { HttpError } from "../middleware/errorHandler";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "";

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
};
