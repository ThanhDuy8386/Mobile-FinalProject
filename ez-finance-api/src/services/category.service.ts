import { Not } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { CreateCategoryDto } from "../dtos/category/CreateCategoryDto";
import { UpdateCategoryDto } from "../dtos/category/UpdateCategoryDto";
import { Budget } from "../entities/Budget";
import { Category } from "../entities/Category";
import { Transaction } from "../entities/Transaction";
import { TransactionType } from "../enums/TransactionType";
import { AppError } from "../utils/AppError";

interface CategoryListQuery {
  type?: unknown;
  keyword?: unknown;
}

export interface CategoryResponse {
  id: number;
  name: string;
  type: TransactionType;
  icon: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  private transactionRepository = AppDataSource.getRepository(Transaction);

  private budgetRepository = AppDataSource.getRepository(Budget);

  async listCategories(
    userId: number,
    query: CategoryListQuery
  ): Promise<CategoryResponse[]> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder("category")
      .where("category.userId = :userId", { userId });

    const type = this.readString(query.type);
    if (type) {
      if (!this.isTransactionType(type)) {
        throw new AppError("Type must be INCOME or EXPENSE", 400);
      }

      queryBuilder.andWhere("category.type = :type", { type });
    }

    const keyword = this.readString(query.keyword);
    if (keyword) {
      queryBuilder.andWhere("category.name LIKE :keyword", {
        keyword: `%${keyword}%`
      });
    }

    const categories = await queryBuilder
      .orderBy("category.type", "ASC")
      .addOrderBy("category.name", "ASC")
      .getMany();

    return categories.map((category) => this.toCategoryResponse(category));
  }

  async getCategory(userId: number, categoryId: number): Promise<CategoryResponse> {
    const category = await this.findOwnedCategory(userId, categoryId);
    return this.toCategoryResponse(category);
  }

  async createCategory(
    userId: number,
    dto: CreateCategoryDto
  ): Promise<CategoryResponse> {
    await this.ensureCategoryIsUnique(userId, dto.name, dto.type);

    const category = this.categoryRepository.create({
      name: dto.name.trim(),
      type: dto.type,
      icon: dto.icon?.trim() || null,
      color: dto.color?.trim() || null,
      userId
    });

    const savedCategory = await this.categoryRepository.save(category);
    return this.toCategoryResponse(savedCategory);
  }

  async updateCategory(
    userId: number,
    categoryId: number,
    dto: UpdateCategoryDto
  ): Promise<CategoryResponse> {
    const category = await this.findOwnedCategory(userId, categoryId);
    const nextName = dto.name?.trim() ?? category.name;
    const nextType = dto.type ?? category.type;

    if (nextName !== category.name || nextType !== category.type) {
      await this.ensureCategoryIsUnique(userId, nextName, nextType, category.id);
    }

    category.name = nextName;
    category.type = nextType;

    if (dto.icon !== undefined) {
      category.icon = dto.icon?.trim() || null;
    }

    if (dto.color !== undefined) {
      category.color = dto.color?.trim() || null;
    }

    const savedCategory = await this.categoryRepository.save(category);
    return this.toCategoryResponse(savedCategory);
  }

  async deleteCategory(userId: number, categoryId: number): Promise<void> {
    const category = await this.findOwnedCategory(userId, categoryId);
    const transactionCount = await this.transactionRepository.count({
      where: {
        userId,
        categoryId: category.id
      }
    });
    const budgetCount = await this.budgetRepository.count({
      where: {
        userId,
        categoryId: category.id
      }
    });

    if (transactionCount > 0 || budgetCount > 0) {
      throw new AppError(
        "Category cannot be deleted because it is used by transactions or budgets",
        400
      );
    }

    await this.categoryRepository.remove(category);
  }

  private async findOwnedCategory(
    userId: number,
    categoryId: number
  ): Promise<Category> {
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      throw new AppError("Category ID must be valid", 400);
    }

    const category = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
        userId
      }
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return category;
  }

  private async ensureCategoryIsUnique(
    userId: number,
    name: string,
    type: TransactionType,
    ignoredCategoryId?: number
  ): Promise<void> {
    const existingCategory = await this.categoryRepository.findOne({
      where: {
        userId,
        name: name.trim(),
        type,
        ...(ignoredCategoryId ? { id: Not(ignoredCategoryId) } : {})
      }
    });

    if (existingCategory) {
      throw new AppError("Category name already exists for this type", 409);
    }
  }

  private toCategoryResponse(category: Category): CategoryResponse {
    return {
      id: category.id,
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    };
  }

  private isTransactionType(type: string): type is TransactionType {
    return type === TransactionType.INCOME || type === TransactionType.EXPENSE;
  }

  private readString(value: unknown): string | undefined {
    const candidate = Array.isArray(value) ? value[0] : value;
    return typeof candidate === "string" && candidate.trim()
      ? candidate.trim()
      : undefined;
  }
}
