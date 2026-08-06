import { IsInt, IsNumber, IsOptional, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class UpdateBudgetDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Category ID must be an integer" })
  @Min(1, { message: "Category ID must be valid" })
  categoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: "Limit amount must be a number" })
  @Min(0.01, { message: "Limit amount must be greater than 0" })
  limitAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Month must be an integer" })
  @Min(1, { message: "Month must be between 1 and 12" })
  @Max(12, { message: "Month must be between 1 and 12" })
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Year must be an integer" })
  @Min(2000, { message: "Year must be between 2000 and 2100" })
  @Max(2100, { message: "Year must be between 2000 and 2100" })
  year?: number;
}
