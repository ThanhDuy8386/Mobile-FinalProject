import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { LoginDto } from "../dtos/auth/LoginDto";
import { RegisterDto } from "../dtos/auth/RegisterDto";
import { authenticate } from "../middleware/auth.middleware";
import { validateDto } from "../middleware/validation.middleware";

const router = Router();
const authController = new AuthController();

router.post("/register", validateDto(RegisterDto), authController.register);
router.post("/login", validateDto(LoginDto), authController.login);
router.get("/me", authenticate, authController.me);

export default router;
