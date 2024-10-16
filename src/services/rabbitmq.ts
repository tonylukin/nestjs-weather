import * as amqp from 'amqplib';
import Mailer from './mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class Rabbitmq {
  private channel: amqp.Channel;
  private connection: amqp.Connection;

  constructor(private readonly mailer: Mailer) {}

  async sendMessage(queue: string, message: any): Promise<void> {
    await this.connectToQueue(queue);

    message = JSON.stringify(message);
    this.channel.sendToQueue(queue, Buffer.from(message), {
      persistent: true,
    });

    console.log(`Sent message: ${message}`);

    setTimeout(() => {
      this.channel.close();
      this.connection.close();
    }, 500);
  }

  async consumeMessage(queue: string): Promise<void> {
    if (queue === '') {
      return;
    }

    await this.connectToQueue(queue);

    try {
      console.log(`Waiting for messages in ${queue}`);

      this.channel.consume(queue, (msg) => {
        if (msg !== null) {
          console.log(`Received message: ${msg.content.toString()}`);
          const message = JSON.parse(msg.content.toString());
          this.mailer
            .sendMail(
              'User request limit reached',
              `User: ${message.userId}, limit: ${message.limit}`,
            )
            .then(() => this.channel.ack(msg))
            .catch(console.error);
        }
      });
    } catch (error) {
      console.error('Error occurred while consuming message:', error);
    }
  }

  private async connectToQueue(queue: string) {
    const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq';

    try {
      this.connection = await amqp.connect(RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Error connecting to RabbitMQ', error);
    }

    await this.channel.assertQueue(queue, {
      durable: true,
    });
  }
}
