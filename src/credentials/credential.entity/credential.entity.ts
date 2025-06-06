import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/users.entity';

@Entity()
export class Credential {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // описание

  @Column()
  login: string;

  @Column()
  password: string; // будет храниться в зашифрованном виде

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  owner: User;
}
