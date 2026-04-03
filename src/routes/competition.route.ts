import { Router } from "express";
import { upload } from "../middleware/upload";
import { authenticate } from "../middleware/auth";
import {
  getCompetitions,
  createCompetition,
  updateCompetition,
  deleteCompetition,
} from "../controllers/competition.controller";

const router = Router();

router.use(authenticate);

router.get("/", getCompetitions);
router.post("/", upload.single("icon"), createCompetition);
router.patch("/:id", upload.single("icon"), updateCompetition);
router.delete("/:id", deleteCompetition);

export default router;
