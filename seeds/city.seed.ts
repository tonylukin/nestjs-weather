import { DataSource } from 'typeorm';
import { City } from '../src/entities/city.entity';

export class CitySeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(City);

    const data = [
      { id: 1, name: 'Moscow' },
      { id: 2, name: 'London' },
      { id: 3, name: 'Berlin' },
      { id: 4, name: 'New York' },
      { id: 5, name: 'Vladivostok' },
    ];

    await repository.save(data);
  }
}
