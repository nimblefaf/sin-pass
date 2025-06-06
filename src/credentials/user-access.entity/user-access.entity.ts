// src/credentials/user-access.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../../users/users.entity';
//import { Credential } from '../credential.entity/credential.entity';

// @Entity()
// @Unique(['user', 'credential']) // чтобы не было повторных доступов
// export class UserAccess {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
//   user: User;

// //   @ManyToOne(() => Credential, { eager: true, onDelete: 'CASCADE' })
// //   credential: Credential;
// }
