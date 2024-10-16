import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { City } from './city.entity';

// todo city_id + created_at - make unique index
@Entity({ name: 'weather_items', schema: 'app' })
export class WeatherItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  weather: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => City, { eager: true })
  @JoinColumn({ name: 'city_id' })
  city: City;
}
