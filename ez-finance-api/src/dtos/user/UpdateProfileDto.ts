import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: "Full name must be a string" })
  @Length(2, 100, {
    message: "Full name must be between 2 and 100 characters"
  })
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: "Email must be valid" })
  email?: string;
}
