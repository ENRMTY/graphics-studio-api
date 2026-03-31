import { Router, Request, Response } from "express";
import { MatchGraphic } from "../models";
import { upload } from "../middleware/upload";
import { uploadImage, deleteImage } from "../utils/cloudinary";
import { HttpError } from "../middleware/errorHandler";
import type { GraphicType, GraphicStatus } from "../models/MatchGraphic";

const router = Router();

// GET /graphics
// query params: type=fulltime|matchday  status=draft|published  limit=20  offset=0
router.get("/", async (req: Request, res: Response) => {
  const {
    type,
    status,
    limit = "50",
    offset = "0",
  } = req.query as {
    type?: string;
    status?: string;
    limit?: string;
    offset?: string;
  };

  const where: Record<string, unknown> = {};
  if (type) {
    where.graphicType = type;
  }
  if (status) {
    where.status = status;
  }

  const { count, rows } = await MatchGraphic.findAndCountAll({
    where,
    order: [["updatedAt", "DESC"]],
    limit: Math.min(parseInt(limit, 10) || 50, 100),
    offset: parseInt(offset, 10) || 0,
  });

  res.json({ success: true, total: count, data: rows });
});

// GET /graphics/:id
router.get("/:id", async (req: Request, res: Response) => {
  const graphic = await MatchGraphic.findByPk(req.params.id);
  if (!graphic) {
    throw new HttpError(404, "Graphic not found");
  }
  res.json({ success: true, data: graphic });
});

// POST /graphics
// creates a new draft (no image — background uploaded separately via PATCH /graphics/:id/background)
router.post("/", async (req: Request, res: Response) => {
  const body = req.body as Partial<MatchGraphic> & {
    graphicType?: GraphicType;
  };

  if (!body.graphicType) {
    throw new HttpError(400, "graphicType is required");
  }
  if (!["fulltime", "matchday"].includes(body.graphicType)) {
    throw new HttpError(400, "graphicType must be fulltime or matchday");
  }

  const graphic = await MatchGraphic.create({
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

  res.status(201).json({ success: true, data: graphic });
});

// PATCH /graphics/:id
// update any fields (except images — use /background endpoint)
router.patch("/:id", async (req: Request, res: Response) => {
  const graphic = await MatchGraphic.findByPk(req.params.id);
  if (!graphic) {
    throw new HttpError(404, "Graphic not found");
  }

  const body = req.body as Partial<MatchGraphic> & { status?: GraphicStatus };

  // Selectively update only provided fields
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

  for (const key of updatable) {
    if (key in body) {
      (graphic as any)[key] = (body as any)[key];
    }
  }

  await graphic.save();
  res.json({ success: true, data: graphic });
});

// PATCH /graphics/:id/background
// separate endpoint for background image upload (multipart)
router.patch(
  "/:id/background",
  upload.single("background"),
  async (req: Request, res: Response) => {
    const graphic = await MatchGraphic.findByPk(req.params.id);
    if (!graphic) {
      throw new HttpError(404, "Graphic not found");
    }
    if (!req.file) {
      throw new HttpError(400, "No image file provided");
    }

    // delete previous background if it exists
    if (graphic.bgImagePublicId) {
      await deleteImage(graphic.bgImagePublicId);
    }

    const result = await uploadImage(req.file.buffer, "lfc-studio/backgrounds");
    graphic.bgImageUrl = result.url;
    graphic.bgImagePublicId = result.publicId;

    await graphic.save();
    res.json({ success: true, data: graphic });
  },
);

// DELETE /graphics/:id
router.delete("/:id", async (req: Request, res: Response) => {
  const graphic = await MatchGraphic.findByPk(req.params.id);
  if (!graphic) {
    throw new HttpError(404, "Graphic not found");
  }

  if (graphic.bgImagePublicId) {
    await deleteImage(graphic.bgImagePublicId);
  }
  await graphic.destroy();

  res.json({ success: true, message: "Graphic deleted" });
});

// GET /graphics/drafts/latest
// convenience endpoint — returns the most recent draft of each type
// used by the frontend to restore session state on load
router.get("/drafts/latest", async (_req: Request, res: Response) => {
  const [ft, md] = await Promise.all([
    MatchGraphic.findOne({
      where: { graphicType: "fulltime", status: "draft" },
      order: [["updatedAt", "DESC"]],
    }),
    MatchGraphic.findOne({
      where: { graphicType: "matchday", status: "draft" },
      order: [["updatedAt", "DESC"]],
    }),
  ]);

  res.json({ success: true, data: { fulltime: ft, matchday: md } });
});

export default router;
