import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendCreated, sendSuccess } from "../utils/response";

export class CategoryController {
  private categoryService = new CategoryService();

  listCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await this.categoryService.listCategories(
      req.user!.id,
      req.query
    );
    return sendSuccess(res, "Categories retrieved successfully", categories);
  });

  getCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.categoryService.getCategory(
      req.user!.id,
      this.parseId(req.params.id, "Category ID")
    );
    return sendSuccess(res, "Category retrieved successfully", category);
  });

  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.categoryService.createCategory(
      req.user!.id,
      req.body
    );
    return sendCreated(res, "Category created successfully", category);
  });

  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.categoryService.updateCategory(
      req.user!.id,
      this.parseId(req.params.id, "Category ID"),
      req.body
    );
    return sendSuccess(res, "Category updated successfully", category);
  });

  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    await this.categoryService.deleteCategory(
      req.user!.id,
      this.parseId(req.params.id, "Category ID")
    );
    return sendSuccess(res, "Category deleted successfully");
  });

  private parseId(value: string, fieldName: string): number {
    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(`${fieldName} must be valid`, 400);
    }

    return id;
  }
}
