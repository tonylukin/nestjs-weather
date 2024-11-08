import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherController } from './controllers/weather.controller';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import RequestLimitService from './services/request-limit.service';
import RedisClient from './services/redis';
import Rabbitmq from './services/rabbitmq';
import Mailer from './services/mailer';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    AuthModule,
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 5,
      },
    ]),
  ],
  controllers: [WeatherController],
  providers: [
    Rabbitmq,
    Mailer,
    RequestLimitService,
    RedisClient,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
    JwtService,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
