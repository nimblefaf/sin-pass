import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Credential {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  login: string;

  @Column()
  encryptedPassword: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.id)
  owner: User;

  @CreateDateColumn()
  createdAt: Date;
}
