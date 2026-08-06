import { IsEmail, IsString, Length, MinLength } from "class-validator";

export class RegisterDto {
  @IsString({ message: "Full name must be a string" })
  @Length(2, 100, {
    message: "Full name must be between 2 and 100 characters"
  })
  fullName!: string;

  @IsEmail({}, { message: "Email must be valid" })
  email!: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  password!: string;
}
