import { IsString, IsEnum } from 'class-validator';
import { UserRole } from 'src/auth/role.enum';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}