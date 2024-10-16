import { DataSource } from 'typeorm';
import { WeatherItem } from '../src/entities/weather.item.entity';
import { City } from '../src/entities/city.entity';

export class WeatherItemSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const weatherItemRepository = dataSource.getRepository(WeatherItem);
    await weatherItemRepository.clear();
    const cityRepository = dataSource.getRepository(City);
    const cities = await cityRepository.find();

    const data = [
      { weather: 'Cloudy', city: cities[0], createdAt: '2024-09-01' },
      { weather: 'Rainy', city: cities[0], createdAt: '2024-08-01' },
      { weather: 'Sunny', city: cities[1], createdAt: '2024-07-01' },
      { weather: 'Rainy', city: cities[1], createdAt: '2024-08-01' },
      { weather: 'Sunny', city: cities[1], createdAt: '2024-09-01' },
      { weather: 'Rainy', city: cities[2], createdAt: '2024-08-01' },
      { weather: 'Cloudy', city: cities[2], createdAt: '2024-07-01' },
      { weather: 'Cloudy', city: cities[3], createdAt: '2024-09-01' },
      { weather: 'Rainy', city: cities[3], createdAt: '2024-07-01' },
      { weather: 'Sunny', city: cities[4], createdAt: '2024-09-01' },
      { weather: 'Rainy', city: cities[4], createdAt: '2024-08-01' },
    ];

    await weatherItemRepository.save(data);
  }
}
