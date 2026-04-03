import { Router } from "express";
import { upload } from "../middleware/upload";
import { authenticate } from "../middleware/auth";
import {
  getGraphics,
  getGraphic,
  createGraphic,
  updateGraphic,
  updateBackground,
  deleteGraphic,
  getLatestDrafts,
} from "../controllers/graphics.controller";

const router = Router();

router.use(authenticate);

router.get("/drafts/latest", getLatestDrafts);
router.get("/", getGraphics);
router.get("/:id", getGraphic);
router.post("/", createGraphic);
router.patch("/:id", updateGraphic);
router.patch("/:id/background", upload.single("background"), updateBackground);
router.delete("/:id", deleteGraphic);

export default router;
