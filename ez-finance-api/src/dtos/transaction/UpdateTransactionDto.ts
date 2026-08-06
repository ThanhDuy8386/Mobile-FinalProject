import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min
} from "class-validator";
import { Type } from "class-transformer";
import { TransactionType } from "../../enums/TransactionType";

export class UpdateTransactionDto {
  @IsOptional()
  @IsString({ message: "Title must be a string" })
  @Length(1, 150, { message: "Title must be at most 150 characters" })
  title?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: "Amount must be a number" })
  @Min(0.01, { message: "Amount must be greater than 0" })
  amount?: number;

  @IsOptional()
  @IsEnum(TransactionType, { message: "Type must be INCOME or EXPENSE" })
  type?: TransactionType;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Category ID must be an integer" })
  @Min(1, { message: "Category ID must be valid" })
  categoryId?: number;

  @IsOptional()
  @IsDateString({}, { message: "Transaction date must be a valid date" })
  transactionDate?: string;

  @IsOptional()
  @IsString({ message: "Note must be a string" })
  @MaxLength(1000, { message: "Note must be at most 1000 characters" })
  note?: string | null;
}
