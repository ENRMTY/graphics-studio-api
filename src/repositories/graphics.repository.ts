import { MatchGraphic } from "../models";
import type { MatchGraphicCreationAttributes } from "../models/MatchGraphic";
import { GraphicType } from "../models/MatchGraphic";

// types
type FindGraphicsOptions = {
  type?: string;
  status?: string;
  limit: number;
  offset: number;
};

export const graphicsRepository = {
  async findAll(options: FindGraphicsOptions) {
    const { type, status, limit, offset } = options;

    const where: Record<string, unknown> = {};

    if (type) {
      where.graphicType = type;
    }

    if (status) {
      where.status = status;
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

  findLatestDraftByType: (type: GraphicType) =>
    MatchGraphic.findOne({
      where: { graphicType: type, status: "draft" },
      order: [["updatedAt", "DESC"]],
    }),
};
