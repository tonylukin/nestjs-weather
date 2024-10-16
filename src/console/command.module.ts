import { Module } from '@nestjs/common';
import { ConsumerCommand } from './consumer.command';
import Rabbitmq from '../services/rabbitmq';
import Mailer from '../services/mailer';

@Module({
  providers: [ConsumerCommand, Rabbitmq, Mailer],
})
export class CommandModule {}
