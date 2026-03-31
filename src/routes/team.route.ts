import { Router } from "express";
import { upload } from "../middleware/upload";
import { createTeam, deleteTeam, getTeam, getTeams, updateTeam } from "../controllers/team.controller";

const router = Router();

// GET /api/teams
router.get("/", getTeams);

// GET /api/teams/:id
router.get("/:id", getTeam);

// POST /api/teams
router.post("/", upload.single("logo"), createTeam);

// PATCH /api/teams/:id
router.patch("/:id", upload.single("logo"), updateTeam);

// DELETE /api/teams/:id
router.delete("/:id", deleteTeam);

export default router;
