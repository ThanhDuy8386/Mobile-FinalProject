import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { ChangePasswordDto } from "../dtos/user/ChangePasswordDto";
import { UpdateProfileDto } from "../dtos/user/UpdateProfileDto";
import { authenticate } from "../middleware/auth.middleware";
import { validateDto } from "../middleware/validation.middleware";

const router = Router();
const userController = new UserController();

router.use(authenticate);

router.get("/profile", userController.getProfile);
router.put("/profile", validateDto(UpdateProfileDto), userController.updateProfile);
router.put(
  "/change-password",
  validateDto(ChangePasswordDto),
  userController.changePassword
);

export default router;
