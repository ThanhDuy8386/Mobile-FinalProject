import {
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from "class-validator";

@ValidatorConstraint({ name: "DifferentPassword", async: false })
export class DifferentPasswordConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string, args: ValidationArguments): boolean {
    const dto = args.object as ChangePasswordDto;
    return value !== dto.currentPassword;
  }

  defaultMessage(): string {
    return "New password must differ from current password";
  }
}

export class ChangePasswordDto {
  @IsString({ message: "Current password must be a string" })
  @IsNotEmpty({ message: "Current password is required" })
  currentPassword!: string;

  @IsString({ message: "New password must be a string" })
  @MinLength(6, {
    message: "New password must be at least 6 characters"
  })
  @Validate(DifferentPasswordConstraint)
  newPassword!: string;
}
