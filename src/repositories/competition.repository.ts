import { Competition } from "../models";

export const competitionRepository = {
  count: () => Competition.count(),

  create: (data: any) => Competition.create(data),

  findById: (id: string) => Competition.findByPk(id),

  delete: (competition: any) => competition.destroy(),

  save: (competition: any) => competition.save(),

  bulkCreate: (data: any) => Competition.bulkCreate(data),

  findByName: (name: string) =>
    Competition.findOne({
      where: { name },
    }),

  findAll: (userId?: string) =>
    Competition.findAll({
      where: userId ? { userId } : {},
      order: [
        ["sortOrder", "ASC"],
        ["name", "ASC"],
      ],
    }),
};
