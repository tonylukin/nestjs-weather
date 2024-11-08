import { User } from '../entities/user.entity';
import { DataSource } from 'typeorm';
import Rabbitmq from './rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class RequestLimitService {
  constructor(
    private dataSource: DataSource,
    private readonly rabbitmq: Rabbitmq,
  ) {}

  async checkLimit(userId: number): Promise<boolean> {
    const user = await this.dataSource
      .getRepository(User)
      .findOneBy({ id: userId });
    if (user === null) {
      console.log(
        `[RequestLimitService::checkLimit] User #${userId} not found`,
      );
      return false;
    }
    user.requestLimit = (user.requestLimit ?? 0) + 1;
    this.dataSource.getRepository(User).save(user);

    if (user.requestLimit < Number(process.env.USER_REQUEST_LIMIT || 100)) {
      return true;
    }

    console.log(
      `[RequestLimitService::checkLimit] User #${userId} has reached request limit`,
    );
    this.rabbitmq.sendMessage(process.env.RABBITMQ_QUEUE_NAME ?? '', {
      userId: user.id,
      limit: user.requestLimit,
    });
    return false;
  }
}
