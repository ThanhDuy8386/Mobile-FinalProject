import { ErrorRequestHandler } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { QueryFailedError } from "typeorm";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { sendError } from "../utils/response";

interface DatabaseError {
  code?: string;
  errno?: number;
  sqlMessage?: string;
}

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  if (error instanceof AppError) {
    sendError(res, error.message, error.statusCode, error.errors ?? []);
    return;
  }

  if (error instanceof TokenExpiredError) {
    sendError(res, "Authorization token has expired", 401);
    return;
  }

  if (error instanceof JsonWebTokenError) {
    sendError(res, "Authorization token is invalid", 401);
    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    sendError(res, "Invalid JSON request body", 400);
    return;
  }

  if (error instanceof QueryFailedError) {
    const databaseError = error.driverError as DatabaseError;

    if (databaseError.errno === 1062 || databaseError.code === "ER_DUP_ENTRY") {
      sendError(res, "Duplicate value already exists", 409);
      return;
    }

    if (
      databaseError.errno === 1451 ||
      databaseError.errno === 1452 ||
      databaseError.code === "ER_ROW_IS_REFERENCED_2" ||
      databaseError.code === "ER_NO_REFERENCED_ROW_2"
    ) {
      sendError(res, "Database relationship constraint failed", 400);
      return;
    }
  }

  const errors =
    env.nodeEnv === "production"
      ? []
      : [
          {
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined
          }
        ];

  sendError(res, "Internal server error", 500, errors);
};
