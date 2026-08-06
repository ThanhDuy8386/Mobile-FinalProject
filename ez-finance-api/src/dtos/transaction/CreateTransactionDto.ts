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

export class CreateTransactionDto {
  @IsString({ message: "Title must be a string" })
  @Length(1, 150, {
    message: "Title is required and must be at most 150 characters"
  })
  title!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: "Amount must be a number" })
  @Min(0.01, { message: "Amount must be greater than 0" })
  amount!: number;

  @IsEnum(TransactionType, { message: "Type must be INCOME or EXPENSE" })
  type!: TransactionType;

  @Type(() => Number)
  @IsInt({ message: "Category ID must be an integer" })
  @Min(1, { message: "Category ID must be valid" })
  categoryId!: number;

  @IsDateString({}, { message: "Transaction date must be a valid date" })
  transactionDate!: string;

  @IsOptional()
  @IsString({ message: "Note must be a string" })
  @MaxLength(1000, { message: "Note must be at most 1000 characters" })
  note?: string | null;
}
