// src/access/access.service.ts

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccess } from './user-access.entity';
import { User } from 'src/users/users.entity';
import { Credential } from 'src/credentials/credentials.entity';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(UserAccess)
    private readonly accessRepository: Repository<UserAccess>,
    @InjectRepository(Credential)
    private readonly credentialRepository: Repository<Credential>,
  ) {}

  // 1. Проверка: имеет ли пользователь доступ к Credential

  async hasAccess(userId: number, credentialId: string): Promise<boolean> {
    const access = await this.accessRepository.findOne({
      where: {
        user: { id: userId } as any,
        credential: { id: credentialId } as any,
      },
      relations: ['user', 'credential'],
    });
    return !!access;
  }

  // 2. Предусловие: выбрасывать ошибку, если доступа нет
  async assertAccess(userId: number, credentialId: string): Promise<void> {
    const allowed = await this.hasAccess(userId, credentialId);
    if (!allowed) {
      throw new ForbiddenException('Нет доступа к этой записи');
    }
  }

  // 3. Назначение доступа 
  async grantAccess(user: User, credentialId: string): Promise<UserAccess> {
    const credential = await this.credentialRepository.findOne({
      where: { id: credentialId },
    });
    if (!credential) {
      throw new NotFoundException('Credential not found');
    }
    
    const exists = await this.accessRepository.findOne({
      where: {
        user: { id: user.id } as User,
        credential: { id: credentialId } as any,
      },
    });
    if (exists) return exists;

    const access = this.accessRepository.create({ user, credential });
    return this.accessRepository.save(access);
  }


  // 4. Отзыв доступа
  async revokeAccess(userId: number, credentialId: string): Promise<void> {
    const result = await this.accessRepository.delete({
      user: { id: userId } as unknown as User,
      credential: { id: credentialId } as unknown as Credential,
    });

    if (!result.affected) {
      throw new NotFoundException('Доступ не найден');
    }
  }

  // 5. Получение списка доступных Credential для пользователя
  async getAccessibleCredentialIds(userId: number): Promise<number[]> {
    const accessRecords = await this.accessRepository.find({
      where: { user: { id: String(userId) } },
      relations: ['credential'],
    });

    return accessRecords.map((access) => Number(access.credential.id));
  }

  async getUsersWithAccessToCredential(credentialId: number): Promise<User[]> {
  const accessRecords = await this.accessRepository.find({
    where: { credential: { id: String(credentialId) } },
    relations: ['user'],
  });

  return accessRecords.map((record) => record.user);
}

}
