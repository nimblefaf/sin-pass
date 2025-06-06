import { Module } from '@nestjs/common';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccess } from './user-access.entity';

@Module({
  controllers: [AccessController],
  providers: [AccessService],

  imports: [TypeOrmModule.forFeature([UserAccess])],
  exports: [TypeOrmModule],
})
export class AccessModule {}
