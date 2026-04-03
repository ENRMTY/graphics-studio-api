import { Router } from "express";
import { upload } from "../middleware/upload";
import { authenticate } from "../middleware/auth";
import {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../controllers/team.controller";

const router = Router();

router.use(authenticate);

router.get("/", getTeams);
router.get("/:id", getTeam);
router.post("/", upload.single("logo"), createTeam);
router.patch("/:id", upload.single("logo"), updateTeam);
router.delete("/:id", deleteTeam);

export default router;
