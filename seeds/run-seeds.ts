import AppDataSource from '../src/config/typeorm.config';
import { UserSeeder } from './user.seed';
import { CitySeeder } from './city.seed';
import { WeatherItemSeeder } from './weather-item.seed';

async function runSeeds() {
  try {
    await AppDataSource.initialize();

    console.log('Running seeds...');

    const seeders = [
      new UserSeeder(),
      new CitySeeder(),
      new WeatherItemSeeder(),
    ];
    for (const seeder of seeders) {
      await seeder.run(AppDataSource);
    }

    console.log('Seeding complete.');
  } catch (error) {
    console.error('Error running seeds:', error);
  } finally {
    // Close the connection
    await AppDataSource.destroy();
  }
}

runSeeds();
