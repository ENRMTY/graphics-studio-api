// external
import { Router, Request, Response } from "express";
import { upload } from "../middleware/upload";
import { uploadImage, deleteImage } from "../utils/cloudinary";

// internal
import { Competition } from "../models";
import { HttpError } from "../middleware/errorHandler";

const router = Router();

const DEFAULT_COMPETITIONS = [
  { name: "Premier League", color: "#3d195b", sortOrder: 1 },
  { name: "Champions League", color: "#001489", sortOrder: 2 },
  { name: "FA Cup", color: "#C8102E", sortOrder: 3 },
  { name: "Carabao Cup", color: "#00A550", sortOrder: 4 },
  { name: "Europa League", color: "#F57F17", sortOrder: 5 },
  { name: "Friendly", color: "#555558", sortOrder: 6 },
];

// GET /competitions
router.get("/", async (_req: Request, res: Response) => {
  // seed defaults on first call if none exist
  const count = await Competition.count();
  if (count === 0) {
    await Competition.bulkCreate(
      DEFAULT_COMPETITIONS.map((c) => ({ ...c, isDefault: true })),
    );
  }

  const competitions = await Competition.findAll({
    order: [
      ["sortOrder", "ASC"],
      ["name", "ASC"],
    ],
  });
  res.json({ success: true, data: competitions });
});

// POST /competitions
router.post("/", upload.single("icon"), async (req: Request, res: Response) => {
  const { name, color } = req.body as { name?: string; color?: string };
  if (!name?.trim()) {
    throw new HttpError(400, "name is required");
  }

  let iconUrl: string | null = null;
  let iconPublicId: string | null = null;

  if (req.file) {
    const result = await uploadImage(
      req.file.buffer,
      "lfc-studio/competitions",
    );
    iconUrl = result.url;
    iconPublicId = result.publicId;
  }

  const competition = await Competition.create({
    name: name.trim(),
    color: color ?? "#C8102E",
    iconUrl,
    iconPublicId,
  });
  res.status(201).json({ success: true, data: competition });
});

// PATCH /competitions/:id
router.patch(
  "/:id",
  upload.single("icon"),
  async (req: Request, res: Response) => {
    const competition = await Competition.findByPk(req.params.id);
    if (!competition) {
      throw new HttpError(404, "Competition not found");
    }

    const { name, color } = req.body as { name?: string; color?: string };
    if (name?.trim()) {
      competition.name = name.trim();
    }
    if (color?.trim()) {
      competition.color = color.trim();
    }

    if (req.file) {
      if (competition.iconPublicId) {
        await deleteImage(competition.iconPublicId);
      }
      const result = await uploadImage(
        req.file.buffer,
        "lfc-studio/competitions",
      );
      competition.iconUrl = result.url;
      competition.iconPublicId = result.publicId;
    }

    await competition.save();
    res.json({ success: true, data: competition });
  },
);

// DELETE /competitions/:id
router.delete("/:id", async (req: Request, res: Response) => {
  const competition = await Competition.findByPk(req.params.id);
  if (!competition) {
    throw new HttpError(404, "Competition not found");
  }
  if (competition.isDefault) {
    throw new HttpError(403, "Cannot delete a default competition");
  }
  if (competition.iconPublicId) {
    await deleteImage(competition.iconPublicId);
  }
  await competition.destroy();

  res.json({ success: true, message: "Competition deleted" });
});

export default router;
