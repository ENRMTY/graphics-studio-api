import { graphicsRepository } from "../repositories/graphics.repository";
import { HttpError } from "../middleware/errorHandler";
import { MatchGraphic } from "../models";
import type { GraphicType, GraphicStatus } from "../models/MatchGraphic";
import { uploadImage, deleteImage } from "../utils/cloudinary";

// types
type GetGraphicsInput = {
  type?: string;
  status?: string;
  limit?: string;
  offset?: string;
};

type CreateGraphicInput = Partial<MatchGraphic> & {
  graphicType?: GraphicType;
};

type UpdateGraphicInput = Partial<MatchGraphic> & {
  status?: GraphicStatus;
};

const updatable: Array<keyof MatchGraphic> = [
  "status",
  "competitionId",
  "competitionName",
  "competitionIconUrl",
  "competitionColor",
  "homeTeamId",
  "homeTeamName",
  "homeTeamLogoUrl",
  "awayTeamId",
  "awayTeamName",
  "awayTeamLogoUrl",
  "homeScore",
  "awayScore",
  "events",
  "matchDate",
  "kickoffTime",
  "venue",
];

export const graphicsService = {
  async getGraphics(input: GetGraphicsInput) {
    const limit = Math.min(parseInt(input.limit ?? "50", 10) || 50, 100);
    const offset = parseInt(input.offset ?? "0", 10) || 0;

    return graphicsRepository.findAll({
      type: input.type,
      status: input.status,
      limit,
      offset,
    });
  },

  async getGraphicById(id: string) {
    if (!id) {
      throw new HttpError(400, "Invalid graphic ID");
    }

    const graphic = await graphicsRepository.findById(id);
    if (!graphic) {
      throw new HttpError(404, "Graphic not found");
    }

    return graphic;
  },

  async createGraphic(body: CreateGraphicInput) {
    if (!body.graphicType) {
      throw new HttpError(400, "graphicType is required");
    }

    if (!["fulltime", "matchday", "halftime"].includes(body.graphicType)) {
      throw new HttpError(400, "graphicType must be fulltime, matchday, or halftime");
    }

    return graphicsRepository.create({
      graphicType: body.graphicType,
      status: "draft",

      competitionId: body.competitionId ?? null,
      competitionName: body.competitionName ?? null,
      competitionIconUrl: body.competitionIconUrl ?? null,
      competitionColor: body.competitionColor ?? null,

      homeTeamId: body.homeTeamId ?? null,
      homeTeamName: body.homeTeamName ?? null,
      homeTeamLogoUrl: body.homeTeamLogoUrl ?? null,

      awayTeamId: body.awayTeamId ?? null,
      awayTeamName: body.awayTeamName ?? null,
      awayTeamLogoUrl: body.awayTeamLogoUrl ?? null,

      homeScore: body.homeScore ?? null,
      awayScore: body.awayScore ?? null,
      events: body.events ?? [],

      matchDate: body.matchDate ?? null,
      kickoffTime: body.kickoffTime ?? null,
      venue: body.venue ?? null,
    });
  },

  async updateGraphic(id: string, body: UpdateGraphicInput) {
    const graphic = await graphicsRepository.findById(id);

    if (!graphic) {
      throw new HttpError(404, "Graphic not found");
    }

    for (const key of updatable) {
      if (key in body) {
        (graphic as any)[key] = (body as any)[key];
      }
    }

    await graphicsRepository.save(graphic);

    return graphic;
  },

  async updateBackground(id: string, file?: Express.Multer.File) {
    const graphic = await graphicsRepository.findById(id);

    if (!graphic) {
      throw new HttpError(404, "Graphic not found");
    }

    if (!file) {
      throw new HttpError(400, "No image file provided");
    }

    // remove previous background
    if (graphic.bgImagePublicId) {
      await deleteImage(graphic.bgImagePublicId);
    }

    const result = await uploadImage(file.buffer, "lfc-studio/backgrounds");

    graphic.bgImageUrl = result.url;
    graphic.bgImagePublicId = result.publicId;

    await graphicsRepository.save(graphic);

    return graphic;
  },

  async deleteGraphic(id: string) {
    const graphic = await graphicsRepository.findById(id);

    if (!graphic) {
      throw new HttpError(404, "Graphic not found");
    }

    if (graphic.bgImagePublicId) {
      await deleteImage(graphic.bgImagePublicId);
    }

    await graphicsRepository.delete(graphic);
  },

  async getLatestDrafts() {
    const [fulltime, halftime, matchday] = await Promise.all([
      graphicsRepository.findLatestDraftByType("fulltime"),
      graphicsRepository.findLatestDraftByType("halftime"),
      graphicsRepository.findLatestDraftByType("matchday"),
    ]);

    return {
      fulltime,
      halftime,
      matchday,
    };
  },
};
