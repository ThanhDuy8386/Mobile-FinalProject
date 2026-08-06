import { Not } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { CreateBudgetDto } from "../dtos/budget/CreateBudgetDto";
import { UpdateBudgetDto } from "../dtos/budget/UpdateBudgetDto";
import { Budget } from "../entities/Budget";
import { Category } from "../entities/Category";
import { Transaction } from "../entities/Transaction";
import { TransactionType } from "../enums/TransactionType";
import { AppError } from "../utils/AppError";

interface BudgetListQuery {
  month?: unknown;
  year?: unknown;
  categoryId?: unknown;
  page?: unknown;
  limit?: unknown;
}

interface PaginationResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface BudgetResponse {
  id: number;
  limitAmount: string;
  spentAmount: string;
  remainingAmount: string;
  percentage: number;
  isExceeded: boolean;
  month: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: number;
    name: string;
    icon: string | null;
    color: string | null;
  };
}

export class BudgetService {
  private budgetRepository = AppDataSource.getRepository(Budget);

  private categoryRepository = AppDataSource.getRepository(Category);

  private transactionRepository = AppDataSource.getRepository(Transaction);

  async listBudgets(
    userId: number,
    query: BudgetListQuery
  ): Promise<PaginationResult<BudgetResponse>> {
    const now = new Date();
    const month = this.parseOptionalMonth(query.month) ?? now.getMonth() + 1;
    const year = this.parseOptionalYear(query.year) ?? now.getFullYear();
    const page = this.parsePositiveInteger(query.page, "page", 1);
    const limit = Math.min(
      this.parsePositiveInteger(query.limit, "limit", 10),
      100
    );

    const queryBuilder = this.budgetRepository
      .createQueryBuilder("budget")
      .leftJoinAndSelect("budget.category", "category")
      .where("budget.userId = :userId", { userId })
      .andWhere("budget.month = :month", { month })
      .andWhere("budget.year = :year", { year });

    const categoryId = this.parseOptionalPositiveInteger(
      query.categoryId,
      "categoryId"
    );
    if (categoryId) {
      queryBuilder.andWhere("budget.categoryId = :categoryId", { categoryId });
    }

    const [budgets, totalItems] = await queryBuilder
      .orderBy("category.name", "ASC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items: await Promise.all(
        budgets.map((budget) => this.toBudgetResponse(budget))
      ),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  async getBudget(userId: number, budgetId: number): Promise<BudgetResponse> {
    const budget = await this.findOwnedBudget(userId, budgetId);
    return this.toBudgetResponse(budget);
  }

  async getBudgetDetail(
    userId: number,
    budgetId: number
  ): Promise<
    BudgetResponse & {
      transactions: {
        id: number;
        title: string;
        amount: string;
        transactionDate: string;
        note: string | null;
      }[];
    }
  > {
    const budget = await this.findOwnedBudget(userId, budgetId);
    const progress = await this.toBudgetResponse(budget);
    const transactions = await this.transactionRepository
      .createQueryBuilder("transaction")
      .where("transaction.userId = :userId", { userId })
      .andWhere("transaction.categoryId = :categoryId", {
        categoryId: budget.categoryId
      })
      .andWhere("transaction.type = :type", { type: TransactionType.EXPENSE })
      .andWhere("MONTH(transaction.transactionDate) = :month", {
        month: budget.month
      })
      .andWhere("YEAR(transaction.transactionDate) = :year", {
        year: budget.year
      })
      .orderBy("transaction.transactionDate", "DESC")
      .addOrderBy("transaction.id", "DESC")
      .getMany();

    return {
      ...progress,
      transactions: transactions.map((transaction) => ({
        id: transaction.id,
        title: transaction.title,
        amount: this.formatMoney(transaction.amount),
        transactionDate: transaction.transactionDate,
        note: transaction.note
      }))
    };
  }

  async createBudget(
    userId: number,
    dto: CreateBudgetDto
  ): Promise<BudgetResponse> {
    await this.findValidExpenseCategory(userId, dto.categoryId);
    await this.ensureBudgetIsUnique(userId, dto.categoryId, dto.month, dto.year);

    const budget = this.budgetRepository.create({
      userId,
      categoryId: dto.categoryId,
      limitAmount: this.toMoneyString(dto.limitAmount),
      month: dto.month,
      year: dto.year
    });

    await this.budgetRepository.save(budget);
    const savedBudget = await this.findOwnedBudget(userId, budget.id);

    return this.toBudgetResponse(savedBudget);
  }

  async updateBudget(
    userId: number,
    budgetId: number,
    dto: UpdateBudgetDto
  ): Promise<BudgetResponse> {
    const budget = await this.findOwnedBudget(userId, budgetId);
    const nextCategoryId = dto.categoryId ?? budget.categoryId;
    const nextMonth = dto.month ?? budget.month;
    const nextYear = dto.year ?? budget.year;

    const category = await this.findValidExpenseCategory(userId, nextCategoryId);

    if (
      nextCategoryId !== budget.categoryId ||
      nextMonth !== budget.month ||
      nextYear !== budget.year
    ) {
      await this.ensureBudgetIsUnique(
        userId,
        nextCategoryId,
        nextMonth,
        nextYear,
        budget.id
      );
    }

    budget.categoryId = nextCategoryId;
    budget.category = category;
    budget.month = nextMonth;
    budget.year = nextYear;

    if (dto.limitAmount !== undefined) {
      budget.limitAmount = this.toMoneyString(dto.limitAmount);
    }

    await this.budgetRepository.save(budget);
    const savedBudget = await this.findOwnedBudget(userId, budget.id);

    return this.toBudgetResponse(savedBudget);
  }

  async deleteBudget(userId: number, budgetId: number): Promise<void> {
    const budget = await this.findOwnedBudget(userId, budgetId);
    await this.budgetRepository.remove(budget);
  }

  async getBudgetProgressForMonth(
    userId: number,
    month: number,
    year: number
  ): Promise<BudgetResponse[]> {
    const budgets = await this.budgetRepository.find({
      where: {
        userId,
        month,
        year
      },
      relations: {
        category: true
      },
      order: {
        category: {
          name: "ASC"
        }
      }
    });

    return Promise.all(budgets.map((budget) => this.toBudgetResponse(budget)));
  }

  private async findOwnedBudget(userId: number, budgetId: number): Promise<Budget> {
    if (!Number.isInteger(budgetId) || budgetId <= 0) {
      throw new AppError("Budget ID must be valid", 400);
    }

    const budget = await this.budgetRepository.findOne({
      where: {
        id: budgetId,
        userId
      },
      relations: {
        category: true
      }
    });

    if (!budget) {
      throw new AppError("Budget not found", 404);
    }

    return budget;
  }

  private async findValidExpenseCategory(
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

    if (category.type !== TransactionType.EXPENSE) {
      throw new AppError("Only expense categories can have budgets", 400);
    }

    return category;
  }

  private async ensureBudgetIsUnique(
    userId: number,
    categoryId: number,
    month: number,
    year: number,
    ignoredBudgetId?: number
  ): Promise<void> {
    const existingBudget = await this.budgetRepository.findOne({
      where: {
        userId,
        categoryId,
        month,
        year,
        ...(ignoredBudgetId ? { id: Not(ignoredBudgetId) } : {})
      }
    });

    if (existingBudget) {
      throw new AppError(
        "Budget already exists for this category, month, and year",
        409
      );
    }
  }

  private async toBudgetResponse(budget: Budget): Promise<BudgetResponse> {
    const spentAmount = await this.calculateSpentAmount(
      budget.userId,
      budget.categoryId,
      budget.month,
      budget.year
    );
    const limit = Number(budget.limitAmount);
    const spent = Number(spentAmount);
    const remaining = limit - spent;
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;

    return {
      id: budget.id,
      limitAmount: this.formatMoney(budget.limitAmount),
      spentAmount: this.formatMoney(spentAmount),
      remainingAmount: this.formatMoney(remaining),
      percentage: this.roundPercentage(percentage),
      isExceeded: spent > limit,
      month: budget.month,
      year: budget.year,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
      category: {
        id: budget.category.id,
        name: budget.category.name,
        icon: budget.category.icon,
        color: budget.category.color
      }
    };
  }

  private async calculateSpentAmount(
    userId: number,
    categoryId: number,
    month: number,
    year: number
  ): Promise<string> {
    const result = (await this.transactionRepository
      .createQueryBuilder("transaction")
      .select("COALESCE(SUM(transaction.amount), 0)", "total")
      .where("transaction.userId = :userId", { userId })
      .andWhere("transaction.categoryId = :categoryId", { categoryId })
      .andWhere("transaction.type = :type", { type: TransactionType.EXPENSE })
      .andWhere("MONTH(transaction.transactionDate) = :month", { month })
      .andWhere("YEAR(transaction.transactionDate) = :year", { year })
      .getRawOne()) as { total: string | null } | undefined;

    return this.formatMoney(result?.total ?? "0.00");
  }

  private parsePositiveInteger(
    value: unknown,
    fieldName: string,
    fallback: number
  ): number {
    const rawValue = this.readString(value);

    if (!rawValue) {
      return fallback;
    }

    const parsedValue = Number(rawValue);

    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
      throw new AppError(`${fieldName} must be a positive integer`, 400);
    }

    return parsedValue;
  }

  private parseOptionalPositiveInteger(
    value: unknown,
    fieldName: string
  ): number | undefined {
    const rawValue = this.readString(value);

    if (!rawValue) {
      return undefined;
    }

    const parsedValue = Number(rawValue);

    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
      throw new AppError(`${fieldName} must be a positive integer`, 400);
    }

    return parsedValue;
  }

  private parseOptionalMonth(value: unknown): number | undefined {
    const month = this.parseOptionalPositiveInteger(value, "month");

    if (month !== undefined && (month < 1 || month > 12)) {
      throw new AppError("Month must be between 1 and 12", 400);
    }

    return month;
  }

  private parseOptionalYear(value: unknown): number | undefined {
    const year = this.parseOptionalPositiveInteger(value, "year");

    if (year !== undefined && (year < 2000 || year > 2100)) {
      throw new AppError("Year must be between 2000 and 2100", 400);
    }

    return year;
  }

  private toMoneyString(value: number): string {
    return value.toFixed(2);
  }

  private formatMoney(value: string | number | null | undefined): string {
    return Number(value ?? 0).toFixed(2);
  }

  private roundPercentage(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private readString(value: unknown): string | undefined {
    const candidate = Array.isArray(value) ? value[0] : value;
    return typeof candidate === "string" && candidate.trim()
      ? candidate.trim()
      : undefined;
  }
}
