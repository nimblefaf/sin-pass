import { Module } from '@nestjs/common';
import { CredentialsController } from './credentials.controller';
import { CredentialsService } from './credentials.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credential } from './credentials.entity';

//import { UserAccess } from './user-access.entity/user-access.entity';
//import { AccessService } from '../access/access.service';

@Module({
  controllers: [CredentialsController],
  providers: [CredentialsService],
  //imports: [TypeOrmModule.forFeature([Credential, UserAccess])],
  imports: [TypeOrmModule.forFeature([Credential])],
  // exports: [TypeOrmModule, AccessService],
  exports: [TypeOrmModule]
})
export class CredentialsModule {}
