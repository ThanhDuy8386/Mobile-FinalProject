import { AppDataSource } from "../config/data-source";
import { CreateTransactionDto } from "../dtos/transaction/CreateTransactionDto";
import { UpdateTransactionDto } from "../dtos/transaction/UpdateTransactionDto";
import { Category } from "../entities/Category";
import { Transaction } from "../entities/Transaction";
import { TransactionType } from "../enums/TransactionType";
import { AppError } from "../utils/AppError";

interface TransactionListQuery {
  page?: unknown;
  limit?: unknown;
  type?: unknown;
  categoryId?: unknown;
  month?: unknown;
  year?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  keyword?: unknown;
  sortBy?: unknown;
  sortOrder?: unknown;
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

export interface TransactionResponse {
  id: number;
  title: string;
  amount: string;
  type: TransactionType;
  transactionDate: string;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: number;
    name: string;
    type: TransactionType;
    icon: string | null;
    color: string | null;
  };
}

const SORT_COLUMNS: Record<string, string> = {
  transactionDate: "transaction.transactionDate",
  amount: "transaction.amount",
  createdAt: "transaction.createdAt",
  title: "transaction.title"
};

export class TransactionService {
  private transactionRepository = AppDataSource.getRepository(Transaction);

  private categoryRepository = AppDataSource.getRepository(Category);

  async listTransactions(
    userId: number,
    query: TransactionListQuery
  ): Promise<PaginationResult<TransactionResponse>> {
    const page = this.parsePositiveInteger(query.page, "page", 1);
    const limit = Math.min(
      this.parsePositiveInteger(query.limit, "limit", 10),
      100
    );
    const sortBy = this.parseSortBy(query.sortBy);
    const sortOrder = this.parseSortOrder(query.sortOrder);

    const queryBuilder = this.transactionRepository
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.category", "category")
      .where("transaction.userId = :userId", { userId });

    const type = this.readString(query.type);
    if (type) {
      if (!this.isTransactionType(type)) {
        throw new AppError("Type must be INCOME or EXPENSE", 400);
      }

      queryBuilder.andWhere("transaction.type = :type", { type });
    }

    const categoryId = this.parseOptionalPositiveInteger(
      query.categoryId,
      "categoryId"
    );
    if (categoryId) {
      queryBuilder.andWhere("transaction.categoryId = :categoryId", {
        categoryId
      });
    }

    const month = this.parseOptionalMonth(query.month);
    const year = this.parseOptionalYear(query.year);
    if (month) {
      queryBuilder.andWhere("MONTH(transaction.transactionDate) = :month", {
        month
      });
      queryBuilder.andWhere("YEAR(transaction.transactionDate) = :year", {
        year: year ?? new Date().getFullYear()
      });
    } else if (year) {
      queryBuilder.andWhere("YEAR(transaction.transactionDate) = :year", {
        year
      });
    }

    const startDate = this.parseOptionalDate(query.startDate, "startDate");
    if (startDate) {
      queryBuilder.andWhere("transaction.transactionDate >= :startDate", {
        startDate
      });
    }

    const endDate = this.parseOptionalDate(query.endDate, "endDate");
    if (endDate) {
      queryBuilder.andWhere("transaction.transactionDate <= :endDate", {
        endDate
      });
    }

    if (startDate && endDate && startDate > endDate) {
      throw new AppError("startDate must be before or equal to endDate", 400);
    }

    const keyword = this.readString(query.keyword);
    if (keyword) {
      queryBuilder.andWhere(
        "(transaction.title LIKE :keyword OR transaction.note LIKE :keyword)",
        {
          keyword: `%${keyword}%`
        }
      );
    }

    const [transactions, totalItems] = await queryBuilder
      .orderBy(SORT_COLUMNS[sortBy], sortOrder)
      .addOrderBy("transaction.id", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items: transactions.map((transaction) =>
        this.toTransactionResponse(transaction)
      ),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  }

  async getTransaction(
    userId: number,
    transactionId: number
  ): Promise<TransactionResponse> {
    const transaction = await this.findOwnedTransaction(userId, transactionId);
    return this.toTransactionResponse(transaction);
  }

  async createTransaction(
    userId: number,
    dto: CreateTransactionDto
  ): Promise<TransactionResponse> {
    const category = await this.findValidCategoryForTransaction(
      userId,
      dto.categoryId,
      dto.type
    );

    const transaction = this.transactionRepository.create({
      title: dto.title.trim(),
      amount: this.toMoneyString(dto.amount),
      type: dto.type,
      categoryId: category.id,
      userId,
      transactionDate: this.normalizeDate(dto.transactionDate),
      note: dto.note?.trim() || null
    });

    await this.transactionRepository.save(transaction);
    const savedTransaction = await this.findOwnedTransaction(
      userId,
      transaction.id
    );

    return this.toTransactionResponse(savedTransaction);
  }

  async updateTransaction(
    userId: number,
    transactionId: number,
    dto: UpdateTransactionDto
  ): Promise<TransactionResponse> {
    const transaction = await this.findOwnedTransaction(userId, transactionId);
    const nextType = dto.type ?? transaction.type;
    const nextCategoryId = dto.categoryId ?? transaction.categoryId;

    const category = await this.findValidCategoryForTransaction(
      userId,
      nextCategoryId,
      nextType
    );

    if (dto.title !== undefined) {
      transaction.title = dto.title.trim();
    }

    if (dto.amount !== undefined) {
      transaction.amount = this.toMoneyString(dto.amount);
    }

    transaction.type = nextType;
    transaction.categoryId = category.id;
    transaction.category = category;

    if (dto.transactionDate !== undefined) {
      transaction.transactionDate = this.normalizeDate(dto.transactionDate);
    }

    if (dto.note !== undefined) {
      transaction.note = dto.note?.trim() || null;
    }

    await this.transactionRepository.save(transaction);
    const savedTransaction = await this.findOwnedTransaction(
      userId,
      transaction.id
    );

    return this.toTransactionResponse(savedTransaction);
  }

  async deleteTransaction(userId: number, transactionId: number): Promise<void> {
    const transaction = await this.findOwnedTransaction(userId, transactionId);
    await this.transactionRepository.remove(transaction);
  }

  private async findOwnedTransaction(
    userId: number,
    transactionId: number
  ): Promise<Transaction> {
    if (!Number.isInteger(transactionId) || transactionId <= 0) {
      throw new AppError("Transaction ID must be valid", 400);
    }

    const transaction = await this.transactionRepository.findOne({
      where: {
        id: transactionId,
        userId
      },
      relations: {
        category: true
      }
    });

    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }

    return transaction;
  }

  private async findValidCategoryForTransaction(
    userId: number,
    categoryId: number,
    type: TransactionType
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

    if (category.type !== type) {
      throw new AppError("Transaction type must match category type", 400);
    }

    return category;
  }

  private toTransactionResponse(transaction: Transaction): TransactionResponse {
    return {
      id: transaction.id,
      title: transaction.title,
      amount: this.formatMoney(transaction.amount),
      type: transaction.type,
      transactionDate: transaction.transactionDate,
      note: transaction.note,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      category: {
        id: transaction.category.id,
        name: transaction.category.name,
        type: transaction.category.type,
        icon: transaction.category.icon,
        color: transaction.category.color
      }
    };
  }

  private parseSortBy(value: unknown): string {
    const sortBy = this.readString(value) ?? "transactionDate";

    if (!Object.keys(SORT_COLUMNS).includes(sortBy)) {
      throw new AppError(
        "sortBy must be one of transactionDate, amount, createdAt, title",
        400
      );
    }

    return sortBy;
  }

  private parseSortOrder(value: unknown): "ASC" | "DESC" {
    const sortOrder = this.readString(value)?.toUpperCase() ?? "DESC";

    if (sortOrder !== "ASC" && sortOrder !== "DESC") {
      throw new AppError("sortOrder must be ASC or DESC", 400);
    }

    return sortOrder;
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

  private parseOptionalDate(
    value: unknown,
    fieldName: string
  ): string | undefined {
    const dateValue = this.readString(value);

    if (!dateValue) {
      return undefined;
    }

    return this.validateDateOnly(dateValue, fieldName);
  }

  private normalizeDate(dateValue: string): string {
    return this.validateDateOnly(dateValue, "transactionDate");
  }

  private validateDateOnly(dateValue: string, fieldName: string): string {
    const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);

    if (!parts) {
      throw new AppError(`${fieldName} must use YYYY-MM-DD format`, 400);
    }

    const year = Number(parts[1]);
    const month = Number(parts[2]);
    const day = Number(parts[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    const isValidDate =
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day;

    if (!isValidDate) {
      throw new AppError(`${fieldName} must be a valid date`, 400);
    }

    return dateValue;
  }

  private toMoneyString(value: number): string {
    return value.toFixed(2);
  }

  private formatMoney(value: string | number | null | undefined): string {
    return Number(value ?? 0).toFixed(2);
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
