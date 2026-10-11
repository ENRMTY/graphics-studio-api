import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";
import {
  getPlayers,
  bulkUpsertPlayers,
  uploadPlayerPhoto,
} from "../controllers/player.controller";

const router = Router();

router.use(authenticate);

router.get("/", getPlayers);
router.post("/photo", upload.single("photo"), uploadPlayerPhoto);
router.post("/bulk", bulkUpsertPlayers);

export default router;
