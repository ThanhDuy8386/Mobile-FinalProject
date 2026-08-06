import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export class UserController {
  private userService = new UserService();

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await this.userService.getProfile(req.user!.id);
    return sendSuccess(res, "Profile retrieved successfully", profile);
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await this.userService.updateProfile(req.user!.id, req.body);
    return sendSuccess(res, "Profile updated successfully", profile);
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    await this.userService.changePassword(req.user!.id, req.body);
    return sendSuccess(res, "Password changed successfully");
  });
}
