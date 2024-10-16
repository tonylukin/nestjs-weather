import { DataSource } from 'typeorm';
import { User } from '../src/entities/user.entity';
import * as bcrypt from 'bcrypt';

export class UserSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const users = [
      { id: 1, password: bcrypt.hashSync('123456', 10), username: 'user1' },
      { id: 2, password: bcrypt.hashSync('111111', 10), username: 'user2' },
      { id: 3, password: bcrypt.hashSync('222222', 10), username: 'user3' },
    ];

    // Insert users into the database
    await userRepository.save(users);
  }
}
