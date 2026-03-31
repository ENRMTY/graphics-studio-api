// external
import { Router } from "express";
import { upload } from "../middleware/upload";

// internal
import {
  getCompetitions,
  createCompetition,
  updateCompetition,
  deleteCompetition,
} from "../controllers/competition.controller";

const router = Router();

// GET /api/competitions
router.get("/", getCompetitions);

// POST /api/competitions
router.post("/", upload.single("icon"), createCompetition);

// PATCH /api/competitions/:id
router.patch("/:id", upload.single("icon"), updateCompetition);

// DELETE /api/competitions/:id
router.delete("/:id", deleteCompetition);

export default router;
