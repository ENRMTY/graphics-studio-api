import { Router } from "express";
import {
	login,
	register,
	me,
	requestPasswordReset,
	resetPassword,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.get("/me", authenticate, me);

export default router;
