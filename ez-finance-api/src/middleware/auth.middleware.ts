import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { AppError } from "../utils/AppError";
import { verifyToken } from "../utils/jwt";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authorization token is required", 401);
    }

    const token = authHeader.slice("Bearer ".length).trim();

    if (!token) {
      throw new AppError("Authorization token is required", 401);
    }

    const payload = verifyToken(token);
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: payload.userId }
    });

    if (!user) {
      throw new AppError("Authenticated user was not found", 401);
    }

    req.user = {
      id: user.id,
      fullName: user.fullName,
      email: user.email
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(new AppError("Authorization token has expired", 401));
      return;
    }

    if (error instanceof JsonWebTokenError) {
      next(new AppError("Authorization token is invalid", 401));
      return;
    }

    next(error);
  }
};
