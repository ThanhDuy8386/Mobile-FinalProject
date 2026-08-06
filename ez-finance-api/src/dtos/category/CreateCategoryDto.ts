import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MaxLength
} from "class-validator";
import { TransactionType } from "../../enums/TransactionType";

export class CreateCategoryDto {
  @IsString({ message: "Name must be a string" })
  @Length(1, 100, { message: "Name is required and must be at most 100 characters" })
  name!: string;

  @IsEnum(TransactionType, { message: "Type must be INCOME or EXPENSE" })
  type!: TransactionType;

  @IsOptional()
  @IsString({ message: "Icon must be a string" })
  @MaxLength(100, { message: "Icon must be at most 100 characters" })
  icon?: string;

  @IsOptional()
  @IsString({ message: "Color must be a string" })
  @MaxLength(20, { message: "Color must be at most 20 characters" })
  color?: string;
}
