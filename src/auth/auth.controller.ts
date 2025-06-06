import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsString } from 'class-validator';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto'; // создадим DTO для ответа

class LoginDto {
  @IsString()
  @ApiProperty({ example: 'john_doe', description: 'Имя пользователя для входа' })
  username: string;

  @IsString()
  @ApiProperty({ example: 'mypassword', description: 'Пароль пользователя' })
  password: string;
}

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Вход пользователя (получить JWT)' })
   @ApiResponse({
    status: 201,
    description: 'Token получен успешно',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    return this.authService.login(user);
  }
}
