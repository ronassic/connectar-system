import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuditService } from '../services/audit.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    ConfigModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback-secret',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService, JwtStrategy, AuditService],
  exports: [UserService, AuthService],
})
export class UserModule {}
