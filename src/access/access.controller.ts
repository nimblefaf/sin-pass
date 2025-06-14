import {
  Controller,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { AccessService } from './access.service';
import { UsersService } from '../users/users.service';
import { CredentialsService } from '../credentials/credentials.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/users.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Access')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('access')
export class AccessController {
  constructor(
    private readonly accessService: AccessService,
    private readonly usersService: UsersService,
    private readonly credentialsService: CredentialsService,
  ) {}

  @Post(':userId/:credentialId')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Выдать пользователю доступ к записи (admin only)' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'credentialId', type: Number })
  @ApiResponse({ status: 201, description: 'Доступ выдан' })
  async grantAccess(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('credentialId', ParseIntPipe) credentialId: string,
  ) {
    const user = await this.usersService.findById(userId.toString());
    const credential = await this.credentialsService.findById(credentialId);
    if (!credential) {
      throw new NotFoundException(`Credential with id ${credentialId} not found`);
    }
    return this.accessService.grantAccess(user, credentialId);
  }

  @Delete(':userId/:credentialId')
  @Roles(UserRole.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Отозвать доступ к записи у пользователя (admin only)' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'credentialId', type: Number })
  @ApiResponse({ status: 204, description: 'Доступ отозван' })
  async revokeAccess(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('credentialId', ParseIntPipe) credentialId: string,
  ) {
    return this.accessService.revokeAccess(userId, credentialId);
  }

  @Get('credential/:credentialId')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Получить список пользователей с доступом к записи' })
  @ApiParam({ name: 'credentialId', type: Number })
  @ApiResponse({ status: 200, description: 'Список пользователей с доступом' })
  async getUsersWithAccess(
    @Param('credentialId', ParseIntPipe) credentialId: number,
  ) {
    return this.accessService.getUsersWithAccessToCredential(credentialId);
  }
}
