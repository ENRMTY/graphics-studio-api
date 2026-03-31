import { Competition } from "../models";

export const competitionRepository = {
  count: () => Competition.count(),

  create: (data: any) => Competition.create(data),

  findById: (id: string) => Competition.findByPk(id),

  delete: (competition: any) => competition.destroy(),

  save: (competition: any) => competition.save(),

  bulkCreate: (data: any) => Competition.bulkCreate(data),

  findAll: () =>
    Competition.findAll({
      order: [
        ["sortOrder", "ASC"],
        ["name", "ASC"],
      ],
    }),
};
