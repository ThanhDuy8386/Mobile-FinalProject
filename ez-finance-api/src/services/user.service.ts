import bcrypt from "bcrypt";
import { Not } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { ChangePasswordDto } from "../dtos/user/ChangePasswordDto";
import { UpdateProfileDto } from "../dtos/user/UpdateProfileDto";
import { User } from "../entities/User";
import { AppError } from "../utils/AppError";
import { SafeUser } from "./auth.service";

const SALT_ROUNDS = 10;

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getProfile(userId: number): Promise<SafeUser> {
    const user = await this.findUserById(userId);
    return this.toSafeUser(user);
  }

  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<SafeUser> {
    if (!dto.fullName && !dto.email) {
      throw new AppError("At least one profile field must be provided", 400);
    }

    const user = await this.findUserById(userId);

    if (dto.email) {
      const normalizedEmail = dto.email.trim().toLowerCase();
      const emailOwner = await this.userRepository.findOne({
        where: {
          email: normalizedEmail,
          id: Not(userId)
        }
      });

      if (emailOwner) {
        throw new AppError("Email is already used by another user", 409);
      }

      user.email = normalizedEmail;
    }

    if (dto.fullName) {
      user.fullName = dto.fullName.trim();
    }

    const savedUser = await this.userRepository.save(user);
    return this.toSafeUser(savedUser);
  }

  async changePassword(userId: number, dto: ChangePasswordDto): Promise<void> {
    if (dto.currentPassword === dto.newPassword) {
      throw new AppError("New password must differ from current password", 400);
    }

    const user = await this.findUserById(userId);
    const passwordMatches = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new AppError("Current password is incorrect", 400);
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await this.userRepository.save(user);
  }

  private async findUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
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
