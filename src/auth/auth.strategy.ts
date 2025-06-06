import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity'; // поправьте путь, если файл называется user.entity.ts
import { UsersService } from '../users/users.service';

export interface JwtPayload {
  sub: string;      // id пользователя
  username: string; // username пользователя
  role: string;     // роль
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) // или можно через UsersService
    private userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), 
    });
  }

  // **Обязательно**: validate вызывается после успешной проверки подписи JWT
  async validate(payload: JwtPayload): Promise<{ userId: string; username: string; role: string }> {
    // Здесь можно проверить, что пользователь всё ещё существует в БД (опционально):
    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }
    // Возвращаем, что попадёт в `req.user`:
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}