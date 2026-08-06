import { Response } from "express";

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export const sendSuccess = (
  res: Response,
  message: string,
  data: unknown = {},
  statusCode = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendCreated = (
  res: Response,
  message: string,
  data: unknown = {}
): Response => {
  return sendSuccess(res, message, data, 201);
};

export const sendList = (
  res: Response,
  message: string,
  data: unknown[],
  pagination: Pagination
): Response => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number,
  errors: unknown[] = []
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};
