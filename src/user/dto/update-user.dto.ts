import { IsString, IsEnum ,IsOptional} from 'class-validator';
import { UserRole } from 'src/auth/role.enum';



export class UpdateUserDto {
    @IsString()
    username?: string;
  
    @IsString()
    @IsOptional()
    password?: string;
  
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
  }