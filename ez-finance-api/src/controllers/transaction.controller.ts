import { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendCreated, sendList, sendSuccess } from "../utils/response";

export class TransactionController {
  private transactionService = new TransactionService();

  listTransactions = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.transactionService.listTransactions(
      req.user!.id,
      req.query
    );
    return sendList(
      res,
      "Transactions retrieved successfully",
      result.items,
      result.pagination
    );
  });

  getTransaction = asyncHandler(async (req: Request, res: Response) => {
    const transaction = await this.transactionService.getTransaction(
      req.user!.id,
      this.parseId(req.params.id, "Transaction ID")
    );
    return sendSuccess(res, "Transaction retrieved successfully", transaction);
  });

  createTransaction = asyncHandler(async (req: Request, res: Response) => {
    const transaction = await this.transactionService.createTransaction(
      req.user!.id,
      req.body
    );
    return sendCreated(res, "Transaction created successfully", transaction);
  });

  updateTransaction = asyncHandler(async (req: Request, res: Response) => {
    const transaction = await this.transactionService.updateTransaction(
      req.user!.id,
      this.parseId(req.params.id, "Transaction ID"),
      req.body
    );
    return sendSuccess(res, "Transaction updated successfully", transaction);
  });

  deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
    await this.transactionService.deleteTransaction(
      req.user!.id,
      this.parseId(req.params.id, "Transaction ID")
    );
    return sendSuccess(res, "Transaction deleted successfully");
  });

  private parseId(value: string, fieldName: string): number {
    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(`${fieldName} must be valid`, 400);
    }

    return id;
  }
}
