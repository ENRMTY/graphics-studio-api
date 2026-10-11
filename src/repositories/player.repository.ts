import { Op, col, fn, where } from "sequelize";
import { Player } from "../models";

export const playerRepository = {
  findAll: (userId?: string | null) =>
    Player.findAll({
      where: userId ? { userId } : { userId: null },
      order: [["lastUsed", "DESC"]],
    }),

  findOneByName: (name: string, userId?: string | null) =>
    Player.findOne({
      where: {
        [Op.and]: [
          userId ? { userId } : { userId: null },
          where(fn("lower", col("name")), name.trim().toLowerCase()),
        ],
      },
    }),

  create: (data: any) => Player.create(data),
};
