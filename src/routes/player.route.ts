import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  getPlayers,
  bulkUpsertPlayers,
} from "../controllers/player.controller";

const router = Router();

router.use(authenticate);

router.get("/", getPlayers);
router.post("/bulk", bulkUpsertPlayers);

export default router;
