import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './audit-log.entity';

@Module({
  controllers: [AuditController],
  providers: [AuditService],

  imports: [TypeOrmModule.forFeature([AuditLog])],
  exports: [TypeOrmModule],
})
export class AuditModule {}
