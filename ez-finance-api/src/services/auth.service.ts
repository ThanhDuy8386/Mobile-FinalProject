import bcrypt from "bcrypt";
import { EntityManager } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { RegisterDto } from "../dtos/auth/RegisterDto";
import { LoginDto } from "../dtos/auth/LoginDto";
import { Category } from "../entities/Category";
import { User } from "../entities/User";
import { TransactionType } from "../enums/TransactionType";
import { AppError } from "../utils/AppError";
import { generateToken } from "../utils/jwt";

const SALT_ROUNDS = 10;

export interface SafeUser {
  id: number;
  fullName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DefaultCategory {
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export const defaultCategories: DefaultCategory[] = [
  {
    name: "Salary",
    type: TransactionType.INCOME,
    icon: "briefcase",
    color: "#2E7D32"
  },
  {
    name: "Freelance",
    type: TransactionType.INCOME,
    icon: "laptop",
    color: "#00897B"
  },
  {
    name: "Investment",
    type: TransactionType.INCOME,
    icon: "trending-up",
    color: "#1565C0"
  },
  {
    name: "Other Income",
    type: TransactionType.INCOME,
    icon: "plus-circle",
    color: "#6A1B9A"
  },
  {
    name: "Food",
    type: TransactionType.EXPENSE,
    icon: "restaurant",
    color: "#FF9800"
  },
  {
    name: "Transport",
    type: TransactionType.EXPENSE,
    icon: "car",
    color: "#1976D2"
  },
  {
    name: "Shopping",
    type: TransactionType.EXPENSE,
    icon: "shopping-bag",
    color: "#C2185B"
  },
  {
    name: "Entertainment",
    type: TransactionType.EXPENSE,
    icon: "film",
    color: "#7B1FA2"
  },
  {
    name: "Bills",
    type: TransactionType.EXPENSE,
    icon: "receipt",
    color: "#455A64"
  },
  {
    name: "Health",
    type: TransactionType.EXPENSE,
    icon: "heart",
    color: "#D32F2F"
  },
  {
    name: "Education",
    type: TransactionType.EXPENSE,
    icon: "book",
    color: "#512DA8"
  },
  {
    name: "Other Expense",
    type: TransactionType.EXPENSE,
    icon: "more-horizontal",
    color: "#607D8B"
  }
];

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  private categoryRepository = AppDataSource.getRepository(Category);

  async register(dto: RegisterDto): Promise<{ user: SafeUser; token: string }> {
    const email = this.normalizeEmail(dto.email);
    const existingUser = await this.userRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new AppError("Email is already registered", 409);
    }

    const savedUser = await AppDataSource.transaction(async (manager) => {
      const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
      const user = manager.create(User, {
        fullName: dto.fullName.trim(),
        email,
        passwordHash
      });
      const createdUser = await manager.save(User, user);

      await this.createDefaultCategoriesWithManager(manager, createdUser.id);

      return createdUser;
    });

    const token = generateToken({
      userId: savedUser.id,
      email: savedUser.email
    });

    return {
      user: this.toSafeUser(savedUser),
      token
    };
  }

  async login(dto: LoginDto): Promise<{ user: SafeUser; token: string }> {
    const email = this.normalizeEmail(dto.email);
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    return {
      user: this.toSafeUser(user),
      token
    };
  }

  async getCurrentUser(userId: number): Promise<SafeUser> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return this.toSafeUser(user);
  }

  async createDefaultCategoriesForUser(userId: number): Promise<void> {
    for (const category of defaultCategories) {
      const existingCategory = await this.categoryRepository.findOne({
        where: {
          userId,
          name: category.name,
          type: category.type
        }
      });

      if (!existingCategory) {
        await this.categoryRepository.save(
          this.categoryRepository.create({
            ...category,
            userId
          })
        );
      }
    }
  }

  private async createDefaultCategoriesWithManager(
    manager: EntityManager,
    userId: number
  ): Promise<void> {
    const categories = defaultCategories.map((category) =>
      manager.create(Category, {
        ...category,
        userId
      })
    );

    await manager.save(Category, categories);
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
