import { forwardRef, Module } from '@nestjs/common';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccess } from './user-access.entity';
import { CredentialsModule } from 'src/credentials/credentials.module';
import { Credential } from 'src/credentials/credentials.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [AccessController],
  providers: [AccessService],

  imports: [
    TypeOrmModule.forFeature([UserAccess, Credential]),
    forwardRef(() => CredentialsModule),
    UsersModule
  ],
  exports: [TypeOrmModule, AccessService],
})
export class AccessModule {}
