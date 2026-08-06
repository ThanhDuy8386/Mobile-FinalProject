import { Request, Response } from "express";
import { BudgetService } from "../services/budget.service";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendCreated, sendList, sendSuccess } from "../utils/response";

export class BudgetController {
  private budgetService = new BudgetService();

  listBudgets = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.budgetService.listBudgets(req.user!.id, req.query);
    return sendList(
      res,
      "Budgets retrieved successfully",
      result.items,
      result.pagination
    );
  });

  getBudget = asyncHandler(async (req: Request, res: Response) => {
    const budget = await this.budgetService.getBudgetDetail(
      req.user!.id,
      this.parseId(req.params.id, "Budget ID")
    );
    return sendSuccess(res, "Budget retrieved successfully", budget);
  });

  createBudget = asyncHandler(async (req: Request, res: Response) => {
    const budget = await this.budgetService.createBudget(req.user!.id, req.body);
    return sendCreated(res, "Budget created successfully", budget);
  });

  updateBudget = asyncHandler(async (req: Request, res: Response) => {
    const budget = await this.budgetService.updateBudget(
      req.user!.id,
      this.parseId(req.params.id, "Budget ID"),
      req.body
    );
    return sendSuccess(res, "Budget updated successfully", budget);
  });

  deleteBudget = asyncHandler(async (req: Request, res: Response) => {
    await this.budgetService.deleteBudget(
      req.user!.id,
      this.parseId(req.params.id, "Budget ID")
    );
    return sendSuccess(res, "Budget deleted successfully");
  });

  private parseId(value: string, fieldName: string): number {
    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(`${fieldName} must be valid`, 400);
    }

    return id;
  }
}
