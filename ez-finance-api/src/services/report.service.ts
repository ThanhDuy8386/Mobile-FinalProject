import { AppDataSource } from "../config/data-source";
import { Transaction } from "../entities/Transaction";
import { TransactionType } from "../enums/TransactionType";
import { AppError } from "../utils/AppError";
import { BudgetService, BudgetResponse } from "./budget.service";

interface ReportQuery {
  month?: unknown;
  year?: unknown;
}

interface MonthlyReportQuery {
  year?: unknown;
}

interface CategoryReportItem {
  categoryId: number;
  categoryName: string;
  icon: string | null;
  color: string | null;
  totalAmount: string;
  percentage: number;
}

export class ReportService {
  private transactionRepository = AppDataSource.getRepository(Transaction);

  private budgetService = new BudgetService();

  async getDashboardSummary(
    userId: number,
    query: ReportQuery
  ): Promise<{
    month: number;
    year: number;
    totalIncome: string;
    totalExpense: string;
    balance: string;
    allTimeBalance: string;
    transactionCount: number;
    recentTransactions: unknown[];
    budgetSummary: BudgetResponse[];
  }> {
    const { month, year } = this.parseMonthYearWithDefaults(query);
    const totalIncome = await this.getTotalByType(
      userId,
      TransactionType.INCOME,
      month,
      year
    );
    const totalExpense = await this.getTotalByType(
      userId,
      TransactionType.EXPENSE,
      month,
      year
    );
    const allTimeIncome = await this.getTotalByType(
      userId,
      TransactionType.INCOME
    );
    const allTimeExpense = await this.getTotalByType(
      userId,
      TransactionType.EXPENSE
    );
    const transactionCount = await this.transactionRepository
      .createQueryBuilder("transaction")
      .where("transaction.userId = :userId", { userId })
      .andWhere("MONTH(transaction.transactionDate) = :month", { month })
      .andWhere("YEAR(transaction.transactionDate) = :year", { year })
      .getCount();
    const recentTransactions = await this.transactionRepository.find({
      where: { userId },
      relations: {
        category: true
      },
      order: {
        transactionDate: "DESC",
        createdAt: "DESC",
        id: "DESC"
      },
      take: 5
    });

    return {
      month,
      year,
      totalIncome,
      totalExpense,
      balance: this.formatMoney(Number(totalIncome) - Number(totalExpense)),
      allTimeBalance: this.formatMoney(
        Number(allTimeIncome) - Number(allTimeExpense)
      ),
      transactionCount,
      recentTransactions: recentTransactions.map((transaction) => ({
        id: transaction.id,
        title: transaction.title,
        amount: this.formatMoney(transaction.amount),
        type: transaction.type,
        transactionDate: transaction.transactionDate,
        note: transaction.note,
        category: {
          id: transaction.category.id,
          name: transaction.category.name,
          type: transaction.category.type,
          icon: transaction.category.icon,
          color: transaction.category.color
        }
      })),
      budgetSummary: await this.budgetService.getBudgetProgressForMonth(
        userId,
        month,
        year
      )
    };
  }

  async getMonthlyReport(
    userId: number,
    query: MonthlyReportQuery
  ): Promise<
    {
      month: number;
      totalIncome: string;
      totalExpense: string;
      balance: string;
    }[]
  > {
    const year = this.parseOptionalYear(query.year) ?? new Date().getFullYear();
    const rows = (await this.transactionRepository
      .createQueryBuilder("transaction")
      .select("MONTH(transaction.transactionDate)", "month")
      .addSelect(
        "COALESCE(SUM(CASE WHEN transaction.type = :incomeType THEN transaction.amount ELSE 0 END), 0)",
        "totalIncome"
      )
      .addSelect(
        "COALESCE(SUM(CASE WHEN transaction.type = :expenseType THEN transaction.amount ELSE 0 END), 0)",
        "totalExpense"
      )
      .where("transaction.userId = :userId", { userId })
      .andWhere("YEAR(transaction.transactionDate) = :year", { year })
      .setParameters({
        incomeType: TransactionType.INCOME,
        expenseType: TransactionType.EXPENSE
      })
      .groupBy("MONTH(transaction.transactionDate)")
      .getRawMany()) as {
      month: number | string;
      totalIncome: string | null;
      totalExpense: string | null;
    }[];

    const totalsByMonth = new Map<number, { income: string; expense: string }>();
    rows.forEach((row) => {
      totalsByMonth.set(Number(row.month), {
        income: this.formatMoney(row.totalIncome ?? "0"),
        expense: this.formatMoney(row.totalExpense ?? "0")
      });
    });

    return Array.from({ length: 12 }, (_item, index) => {
      const month = index + 1;
      const totals = totalsByMonth.get(month) ?? {
        income: "0.00",
        expense: "0.00"
      };

      return {
        month,
        totalIncome: totals.income,
        totalExpense: totals.expense,
        balance: this.formatMoney(Number(totals.income) - Number(totals.expense))
      };
    });
  }

  async getExpensesByCategory(
    userId: number,
    query: ReportQuery
  ): Promise<CategoryReportItem[]> {
    const { month, year } = this.parseMonthYearWithDefaults(query);
    return this.getCategoryReport(
      userId,
      TransactionType.EXPENSE,
      month,
      year
    );
  }

  async getIncomeByCategory(
    userId: number,
    query: ReportQuery
  ): Promise<CategoryReportItem[]> {
    const { month, year } = this.parseMonthYearWithDefaults(query);
    return this.getCategoryReport(userId, TransactionType.INCOME, month, year);
  }

  private async getCategoryReport(
    userId: number,
    type: TransactionType,
    month: number,
    year: number
  ): Promise<CategoryReportItem[]> {
    const rows = (await this.transactionRepository
      .createQueryBuilder("transaction")
      .innerJoin("transaction.category", "category")
      .select("category.id", "categoryId")
      .addSelect("category.name", "categoryName")
      .addSelect("category.icon", "icon")
      .addSelect("category.color", "color")
      .addSelect("COALESCE(SUM(transaction.amount), 0)", "totalAmount")
      .where("transaction.userId = :userId", { userId })
      .andWhere("transaction.type = :type", { type })
      .andWhere("MONTH(transaction.transactionDate) = :month", { month })
      .andWhere("YEAR(transaction.transactionDate) = :year", { year })
      .groupBy("category.id")
      .addGroupBy("category.name")
      .addGroupBy("category.icon")
      .addGroupBy("category.color")
      .orderBy("totalAmount", "DESC")
      .getRawMany()) as {
      categoryId: number | string;
      categoryName: string;
      icon: string | null;
      color: string | null;
      totalAmount: string | null;
    }[];

    const total = rows.reduce(
      (sum, row) => sum + Number(row.totalAmount ?? 0),
      0
    );

    return rows.map((row) => {
      const amount = Number(row.totalAmount ?? 0);

      return {
        categoryId: Number(row.categoryId),
        categoryName: row.categoryName,
        icon: row.icon,
        color: row.color,
        totalAmount: this.formatMoney(amount),
        percentage: total > 0 ? this.roundPercentage((amount / total) * 100) : 0
      };
    });
  }

  private async getTotalByType(
    userId: number,
    type: TransactionType,
    month?: number,
    year?: number
  ): Promise<string> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder("transaction")
      .select("COALESCE(SUM(transaction.amount), 0)", "total")
      .where("transaction.userId = :userId", { userId })
      .andWhere("transaction.type = :type", { type });

    if (month && year) {
      queryBuilder
        .andWhere("MONTH(transaction.transactionDate) = :month", { month })
        .andWhere("YEAR(transaction.transactionDate) = :year", { year });
    }

    const result = (await queryBuilder.getRawOne()) as
      | { total: string | null }
      | undefined;

    return this.formatMoney(result?.total ?? "0");
  }

  private parseMonthYearWithDefaults(query: ReportQuery): {
    month: number;
    year: number;
  } {
    const now = new Date();
    return {
      month: this.parseOptionalMonth(query.month) ?? now.getMonth() + 1,
      year: this.parseOptionalYear(query.year) ?? now.getFullYear()
    };
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
