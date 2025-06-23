import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { UserModule } from './user.module';
import { SeedService } from '../services/seed.service';
import { AuditService } from '../services/audit.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User],
      synchronize: true, // Only for development
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [SeedService, AuditService],
})
export class AppModule {}
