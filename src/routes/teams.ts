import { Router, Request, Response } from "express";
import { Team } from "../models";
import { upload } from "../middleware/upload";
import { uploadImage, deleteImage } from "../utils/cloudinary";
import { HttpError } from "../middleware/errorHandler";

const router = Router();

// GET /teams
router.get("/", async (_req: Request, res: Response) => {
  const teams = await Team.findAll({ order: [["name", "ASC"]] });
  res.json({ success: true, data: teams });
});

// GET /teams/:id
router.get("/:id", async (req: Request, res: Response) => {
  const team = await Team.findByPk(req.params.id);
  if (!team) {
    throw new HttpError(404, "Team not found");
  }
  res.json({ success: true, data: team });
});

// POST /teams
router.post("/", upload.single("logo"), async (req: Request, res: Response) => {
  const { name } = req.body as { name?: string };
  if (!name?.trim()) {
    throw new HttpError(400, "name is required");
  }

  let logoUrl: string | null = null;
  let logoPublicId: string | null = null;

  if (req.file) {
    const result = await uploadImage(req.file.buffer, "lfc-studio/teams");
    logoUrl = result.url;
    logoPublicId = result.publicId;
  }

  const team = await Team.create({ name: name.trim(), logoUrl, logoPublicId });
  res.status(201).json({ success: true, data: team });
});

// PATCH /teams/:id
router.patch(
  "/:id",
  upload.single("logo"),
  async (req: Request, res: Response) => {
    const team = await Team.findByPk(req.params.id);
    if (!team) {
      throw new HttpError(404, "Team not found");
    }

    const { name } = req.body as { name?: string };
    if (name?.trim()) {
      team.name = name.trim();
    }

    if (req.file) {
      // delete old logo from Cloudinary before uploading the new one
      if (team.logoPublicId) {
        await deleteImage(team.logoPublicId);
      }

      const result = await uploadImage(req.file.buffer, "lfc-studio/teams");
      team.logoUrl = result.url;
      team.logoPublicId = result.publicId;
    }

    await team.save();
    res.json({ success: true, data: team });
  },
);

// DELETE /teams/:id
router.delete("/:id", async (req: Request, res: Response) => {
  const team = await Team.findByPk(req.params.id);
  if (!team) {
    throw new HttpError(404, "Team not found");
  }

  if (team.logoPublicId) {
    await deleteImage(team.logoPublicId);
  }
  await team.destroy();

  res.json({ success: true, message: "Team deleted" });
});

export default router;
