// src/credentials/credentials.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly service: CredentialsService) {}

  @Post()
  create(@Request() req, @Body() dto) {
    return this.service.create(req.user, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.service.findOne(id, req.user);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto) {
    return this.service.update(id, req.user, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.service.remove(id, req.user);
  }
}
