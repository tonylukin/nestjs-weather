import { Command, CommandRunner } from 'nest-commander';
import Rabbitmq from '../services/rabbitmq';

@Command({
  name: 'consumer',
  description: 'Console Consumer',
  options: { isDefault: true },
})
export class ConsumerCommand extends CommandRunner {
  constructor(private rabbitmq: Rabbitmq) {
    super();
  }

  async run(): Promise<void> {
    console.log(process.env.RABBITMQ_URL);
    await this.rabbitmq.consumeMessage(process.env.RABBITMQ_QUEUE_NAME);
  }
}
