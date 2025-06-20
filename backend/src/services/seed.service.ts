import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserRole } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const users = await this.userService.findAll();
    if (users.length === 0) {
      const rawPassword = this.configService.get<string>('SEED_ADMIN_PASSWORD') || '111111';
      //const hashedPassword = await bcrypt.hash(rawPassword, 10);

      const dataLogin = new Date();
      const oldLoginDate = new Date();
      oldLoginDate.setDate(oldLoginDate.getDate() - 61); // Define 60 dias atrás

      await this.userService.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: rawPassword,
        role: UserRole.ADMIN,
        lastlogin: dataLogin
      });

      await this.userService.create({
        name: 'Usuário',
        email: 'usuario@example.com',
        password: rawPassword,
        role: UserRole.USER,
        lastlogin: oldLoginDate
      });

      console.log('[SeedService] Admin user created ✔');
    }
  }
}
