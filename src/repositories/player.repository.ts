import { Player } from "../models";

export const playerRepository = {
  findAll: (userId?: string | null) =>
    Player.findAll({
      where: userId ? { userId } : { userId: null },
      order: [["lastUsed", "DESC"]],
    }),

  findOneByName: (name: string, userId?: string | null) =>
    Player.findOne({
      where: userId ? { userId, name } : { userId: null as any, name },
    }),

  create: (data: any) => Player.create(data),
};
