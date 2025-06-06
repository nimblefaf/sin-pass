import { IsString, IsEnum, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../users.entity';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: 'john_doe', description: 'Уникальное имя пользователя' })
  username: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'securePass123', description: 'Пароль (мин. 6 символов)' })
  password: string;

  @IsEnum(UserRole)
  @ApiProperty({
    example: UserRole.User,
    enum: UserRole,
    description: 'Роль пользователя: user или admin',
  })
  role: UserRole;
}
