// auth/dto/auth.dto.ts

import { IsString, IsEnum, IsOptional ,MaxLength,Matches,MinLength} from 'class-validator';
import { UserRole } from 'src/auth/role.enum';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  // Password complexity validation: at least one uppercase, one lowercase, one number, and one special character
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}