import { Request, Response } from "express";
import { ReportService } from "../services/report.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export class ReportController {
  private reportService = new ReportService();

  dashboard = asyncHandler(async (req: Request, res: Response) => {
    const summary = await this.reportService.getDashboardSummary(
      req.user!.id,
      req.query
    );
    return sendSuccess(
      res,
      "Dashboard summary retrieved successfully",
      summary
    );
  });

  monthly = asyncHandler(async (req: Request, res: Response) => {
    const report = await this.reportService.getMonthlyReport(
      req.user!.id,
      req.query
    );
    return sendSuccess(res, "Monthly report retrieved successfully", report);
  });

  expensesByCategory = asyncHandler(async (req: Request, res: Response) => {
    const report = await this.reportService.getExpensesByCategory(
      req.user!.id,
      req.query
    );
    return sendSuccess(
      res,
      "Expense report by category retrieved successfully",
      report
    );
  });

  incomeByCategory = asyncHandler(async (req: Request, res: Response) => {
    const report = await this.reportService.getIncomeByCategory(
      req.user!.id,
      req.query
    );
    return sendSuccess(
      res,
      "Income report by category retrieved successfully",
      report
    );
  });
}
