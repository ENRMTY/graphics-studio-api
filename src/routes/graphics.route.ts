import { Router, Request, Response } from "express";
import { upload } from "../middleware/upload";
import {
  createGraphic,
  deleteGraphic,
  getGraphic,
  getGraphics,
  getLatestDrafts,
  updateBackground,
  updateGraphic,
} from "../controllers/graphics.controller";

const router = Router();

// GET /api/graphics
// query params: type=fulltime|matchday  status=draft|published  limit=20  offset=0
router.get("/", getGraphics);

// GET /api/graphics/:id
router.get("/:id", getGraphic);

// POST /api/graphics
// creates a new draft (no image — background uploaded separately via PATCH /graphics/:id/background)
router.post("/", createGraphic);

// PATCH /api/graphics/:id
// update any fields (except images — use /background endpoint)
router.patch("/:id", updateGraphic);

// PATCH /api/graphics/:id/background
// separate endpoint for background image upload (multipart)
router.patch("/:id/background", upload.single("background"), updateBackground);

// DELETE /api/graphics/:id
router.delete("/:id", deleteGraphic);

// GET /api/graphics/drafts/latest
// convenience endpoint — returns the most recent draft of each type
// used by the frontend to restore session state on load
router.get("/drafts/latest", getLatestDrafts);

export default router;
