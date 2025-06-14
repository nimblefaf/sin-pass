// src/credentials/credentials.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Credential } from './credential.entity/credential.entity';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { encrypt, decrypt } from './crypto.util';
import { AccessService } from 'src/access/access.service';

@Injectable()
export class CredentialsService {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialsRepo: Repository<Credential>,
    private readonly accessService: AccessService
  ) {}

  async findOneSecure(id: string, userId: number): Promise<Credential> {
  await this.accessService.assertAccess(userId, id);
  const credential = await this.credentialsRepo.findOne({ where: { id: id.toString() } });
  if (!credential) throw new NotFoundException();
  return credential;
}

//   async grantAccessToUser(owner: User, credentialId: string, targetUserId: string) {
//   const credential = await this.credentialsRepo.findOne({
//     where: { id: credentialId },
//     relations: ['owner'],
//   });
//   if (!credential) throw new NotFoundException();
//   if (credential.owner.id !== owner.id) throw new ForbiddenException();

//   const target = await this.credentialsRepo.manager.findOne(User, { where: { id: targetUserId } });
//   if (!target) throw new NotFoundException('Target user not found');

//   return AccessService.grantAccess(target, credential);
// }
  async findById(credentialId: string): Promise<Credential | null> {
    return this.credentialsRepo.findOne({ where: { id: credentialId } });
  }


  async create(user: User, dto: { name: string; login: string; password: string }) {
    const credential = this.credentialsRepo.create({
      ...dto,
      password: encrypt(dto.password),
      owner: user,
    });
    return this.credentialsRepo.save(credential);
  }

//   async findAllForUser(user: User) {
//   const owned = await this.credentialsRepo.find({ where: { owner: user } });
//   const shared = await this.accessService.getAllCredentialsForUser(user);
//   const all = [...owned, ...shared.filter(s => !owned.find(o => o.id === s.id))]; // избежать дубликатов
//   return all.map(c => ({
//     ...c,
//     password: decrypt(c.password),
//   }));
// }

  async findOne(id: string, user: User) {
  const credential = await this.credentialsRepo.findOne({
    where: { id },
    relations: ['owner'],
  });
  if (!credential) throw new NotFoundException();

//   const hasAccess = await this.accessService.hasAccess(user, credential);
//   if (!hasAccess) throw new ForbiddenException();

  return {
    ...credential,
    password: decrypt(credential.password),
  };
}

  async update(id: string, user: User, dto: { name?: string; login?: string; password?: string }) {
    const credential = await this.credentialsRepo.findOne({ where: { id }, relations: ['owner'] });
    if (!credential) throw new NotFoundException();
    if (credential.owner.id !== user.id) throw new ForbiddenException();

    if (dto.password) {
      dto.password = encrypt(dto.password);
    }

    Object.assign(credential, dto);
    return this.credentialsRepo.save(credential);
  }

  async remove(id: string, user: User) {
    const credential = await this.credentialsRepo.findOne({ where: { id }, relations: ['owner'] });
    if (!credential) throw new NotFoundException();
    if (credential.owner.id !== user.id) throw new ForbiddenException();

    return this.credentialsRepo.remove(credential);
  }
}
