import { Team } from "../models";

export const teamRepository = {
  findAll: (userId?: string) =>
    Team.findAll({
      where: userId ? { userId } : {},
      order: [["name", "ASC"]],
    }),

  findById: (id: string) => Team.findByPk(id),

  findByName: (name: string) =>
    Team.findOne({
      where: { name },
    }),

  create: (data: {
    name: string;
    userId: string | null;
    logoUrl: string | null;
    logoPublicId: string | null;
  }) => Team.create(data),

  save: (team: Team) => team.save(),

  delete: (team: Team) => team.destroy(),
};
