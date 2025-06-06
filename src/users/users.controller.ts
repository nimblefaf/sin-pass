import { Controller, Post, Get, Body, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole, User } from './users.entity';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  //@Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Создать нового пользователя (только Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь создан',
    type: User, // возвращаемая сущность
  })
  @ApiResponse({ status: 403, description: 'Нет прав доступа' })
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @Get()
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Получить список всех пользователей (только Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Получить пользователя по ID (только Admin)' })
  @ApiParam({ name: 'id', description: 'UUID пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь найден', type: User })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }
}
