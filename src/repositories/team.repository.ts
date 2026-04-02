import { Team } from "../models";

export const teamRepository = {
  findAll: () =>
    Team.findAll({
      order: [["name", "ASC"]],
    }),

  findById: (id: string) => Team.findByPk(id),

  findByName: (name: string) =>
    Team.findOne({
      where: { name },
    }),

  create: (data: {
    name: string;
    logoUrl: string | null;
    logoPublicId: string | null;
  }) => Team.create(data),

  save: (team: Team) => team.save(),

  delete: (team: Team) => team.destroy(),
};
