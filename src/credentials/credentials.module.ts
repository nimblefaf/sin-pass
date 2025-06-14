import { forwardRef, Module } from '@nestjs/common';
import { CredentialsController } from './credentials.controller';
import { CredentialsService } from './credentials.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credential } from './credentials.entity';

import { UserAccess } from './user-access.entity/user-access.entity';
import { AccessModule } from 'src/access/access.module';
import { AccessService } from '../access/access.service';

@Module({
  controllers: [CredentialsController],
  providers: [CredentialsService, AccessService],
  //imports: [TypeOrmModule.forFeature([Credential, UserAccess])],
  imports: [
    TypeOrmModule.forFeature([Credential]),
    forwardRef(() => AccessModule)
  ],
   //exports: [TypeOrmModule, AccessService],
  exports: [TypeOrmModule, CredentialsService]
})
export class CredentialsModule {}
