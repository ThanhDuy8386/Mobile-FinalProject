import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendCreated, sendSuccess } from "../utils/response";

export class AuthController {
  private authService = new AuthService();

  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    return sendCreated(res, "User registered successfully", result);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);
    return sendSuccess(res, "Login successful", result);
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.authService.getCurrentUser(req.user!.id);
    return sendSuccess(res, "Current user retrieved successfully", user);
  });
}
