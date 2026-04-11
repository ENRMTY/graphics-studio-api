import { graphicsRepository } from "../repositories/graphics.repository";
import { HttpError } from "../middleware/errorHandler";
import { MatchGraphic } from "../models";
import type { GraphicType, GraphicStatus } from "../models/MatchGraphic";
import { uploadImage, deleteImage } from "../utils/cloudinary";
import { UPDATABLE_FIELDS as updatable } from "../constants/graphics.constants";

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

export const graphicsService = {
  async getGraphics(input: GetGraphicsInput, userId?: string) {
    const limit = Math.min(parseInt(input.limit ?? "50", 10) || 50, 100);
    const offset = parseInt(input.offset ?? "0", 10) || 0;
    return graphicsRepository.findAll({
      type: input.type,
      status: input.status,
      limit,
      offset,
      userId,
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

  async createGraphic(body: CreateGraphicInput, userId?: string) {
    if (!body.graphicType) {
      throw new HttpError(400, "graphicType is required");
    }
    if (
      ![
        "fulltime",
        "matchday",
        "halftime",
        "stats",
        "quote",
        "transfer",
      ].includes(body.graphicType)
    ) {
      throw new HttpError(
        400,
        "graphicType must be fulltime, matchday, halftime, stats, quote, or transfer",
      );
    }

    return graphicsRepository.create({
      graphicType: body.graphicType,
      status: "draft",
      userId: userId ?? null,

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
      aggScoreHome: (body as any).aggScoreHome ?? null,
      aggScoreAway: (body as any).aggScoreAway ?? null,
      events: body.events ?? [],

      matchDate: body.matchDate ?? null,
      kickoffTime: body.kickoffTime ?? null,
      venue: body.venue ?? null,

      playerName: body.playerName ?? null,
      playerImageUrl: body.playerImageUrl ?? null,
      playerImagePublicId: body.playerImagePublicId ?? null,
      statsData: body.statsData ?? null,
      accentColor: body.accentColor ?? null,

      playerRole: body.playerRole ?? null,
      quoteText: body.quoteText ?? null,
      matchContext: (body as any).matchContext ?? null,
      graphicLayout: (body as any).graphicLayout ?? null,
      transferKind: (body as any).transferKind ?? null,
      transferFee: (body as any).transferFee ?? null,
      transferStatus: (body as any).transferStatus ?? null,
    });
  },

  async updateGraphic(id: string, body: UpdateGraphicInput) {
    const graphic = await graphicsRepository.findById(id);
    if (!graphic) {
      throw new HttpError(404, "Graphic not found");
    }

    for (const key of updatable) {
      if (key in body) (graphic as any)[key] = (body as any)[key];
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
    if (graphic.bgImagePublicId) {
      await deleteImage(graphic.bgImagePublicId);
    }

    const result = await uploadImage(
      file.buffer,
      "eol-graphics-studio/backgrounds",
    );

    graphic.bgImageUrl = result.url;
    graphic.bgImagePublicId = result.publicId;

    await graphicsRepository.save(graphic);

    return graphic;
  },

  async updatePlayerImage(id: string, file?: Express.Multer.File) {
    const graphic = await graphicsRepository.findById(id);
    if (!graphic) {
      throw new HttpError(404, "Graphic not found");
    }
    if (!file) {
      throw new HttpError(400, "No image file provided");
    }
    if (graphic.playerImagePublicId) {
      await deleteImage(graphic.playerImagePublicId);
    }

    const result = await uploadImage(
      file.buffer,
      "eol-graphics-studio/players",
    );

    graphic.playerImageUrl = result.url;
    graphic.playerImagePublicId = result.publicId;

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

  async getLatestDrafts(userId?: string) {
    const [fulltime, halftime, matchday, stats, quote, transfer] =
      await Promise.all([
        graphicsRepository.findLatestDraftByType("fulltime", userId),
        graphicsRepository.findLatestDraftByType("halftime", userId),
        graphicsRepository.findLatestDraftByType("matchday", userId),
        graphicsRepository.findLatestDraftByType("stats", userId),
        graphicsRepository.findLatestDraftByType("quote", userId),
        graphicsRepository.findLatestDraftByType("transfer", userId),
      ]);
    return { fulltime, halftime, matchday, stats, quote, transfer };
  },
};
