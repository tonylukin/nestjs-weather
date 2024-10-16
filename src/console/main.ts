import { CommandFactory } from 'nest-commander';
import { CommandModule } from './command.module';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config({
    path: ['.env.local', '.env'],
  });

  const app = await NestFactory.createApplicationContext(CommandModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  await CommandFactory.run(CommandModule);

  await app.close();
}

bootstrap();
