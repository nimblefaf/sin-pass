// src/credentials/access.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAccess } from './user-access.entity';
import { Repository } from 'typeorm';
import { Credential } from '../credentials/credential.entity/credential.entity';
import { User } from '../users/users.entity';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(UserAccess)
    private accessRepo: Repository<UserAccess>,
  ) {}

  async grantAccess(user: User, credential: Credential) {
    const existing = await this.accessRepo.findOne({ where: { user, credential } });
    if (!existing) {
      const access = this.accessRepo.create({ user, credential });
      return this.accessRepo.save(access);
    }
    return existing;
  }

  async revokeAccess(user: User, credential: Credential) {
    await this.accessRepo.delete({ user, credential });
  }

  async getAllUsersWithAccess(credential: Credential): Promise<User[]> {
    const accesses = await this.accessRepo.find({ where: { credential } });
    return accesses.map(a => a.user);
  }

//   async getAllCredentialsForUser(user: User): Promise<Credential[]> {
//     const accesses = await this.accessRepo.find({ where: { user } });
//     return accesses.map(a => a.credential);
//   }

  async hasAccess(user: User, credential: Credential): Promise<boolean> {
    if (credential.owner.id === user.id) return true;

    const access = await this.accessRepo.findOne({ where: { user, credential } });
    return !!access;
  }
}
