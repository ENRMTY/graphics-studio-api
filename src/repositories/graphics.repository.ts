import { MatchGraphic } from "../models";
import type { MatchGraphicCreationAttributes } from "../models/MatchGraphic";
import { GraphicType } from "../models/MatchGraphic";

type FindGraphicsOptions = {
  type?: string;
  status?: string;
  limit: number;
  offset: number;
  userId?: string;
};

export const graphicsRepository = {
  async findAll(options: FindGraphicsOptions) {
    const { type, status, limit, offset, userId } = options;
    const where: Record<string, unknown> = {};
    if (type) {
      where.graphicType = type;
    }
    if (status) {
      where.status = status;
    }
    if (userId) {
      where.userId = userId;
    }

    return MatchGraphic.findAndCountAll({
      where,
      order: [["updatedAt", "DESC"]],
      limit,
      offset,
    });
  },

  findById: (id: string) => MatchGraphic.findByPk(id),

  create: (data: MatchGraphicCreationAttributes) => MatchGraphic.create(data),

  save: (graphic: MatchGraphic) => graphic.save(),

  delete: (graphic: MatchGraphic) => graphic.destroy(),

  findLatestDraftByType: (type: GraphicType, userId?: string) =>
    MatchGraphic.findOne({
      where: {
        graphicType: type,
        status: "draft",
        ...(userId ? { userId } : {}),
      },
      order: [["updatedAt", "DESC"]],
    }),
};
