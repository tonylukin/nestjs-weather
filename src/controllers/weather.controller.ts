import { Controller, Get, Req, Res, Query } from '@nestjs/common';
import { Request, Response } from 'express';
import RequestLimitService from '../services/request.limit.service';
import RedisClient from '../services/redis';
import { WeatherItem } from '../entities/weather.item.entity';
import { DataSource } from 'typeorm';
import { UserDecorator } from '../auth/user.decorator';
import { User } from '../entities/user.entity';

const CACHE_TTL = 5 * 60;

@Controller('weather')
export class WeatherController {
  constructor(
    private readonly requestLimitService: RequestLimitService,
    private readonly redisClient: RedisClient,
    private dataSource: DataSource,
  ) {}

  @Get('/find')
  async search(
    @Query() query: any,
    @Req() req: Request,
    @Res() res: Response,
    @UserDecorator() user: User,
  ) {
    const { city_name, date } = query;

    if (!city_name) {
      return res.status(400).json({
        error: 'City name is required',
      });
    }
    if (!date) {
      return res.status(400).json({
        error: 'Date is required',
      });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        error: 'Date is incorrect',
      });
    }

    // todo use event emitter
    const requestAllowed = await this.requestLimitService.checkLimit(user.id);
    if (!requestAllowed) {
      return res.status(403).json({
        error: 'You have reached requests limit',
      });
    }

    const CACHE_KEY = `__weather_cache_key_${req.query.city_name}_${req.query.date}`;
    const cachedData = await this.redisClient.client.get(CACHE_KEY);
    if (cachedData) {
      return res.json({
        weatherItem: JSON.parse(cachedData),
      });
    }

    const repository = this.dataSource.getRepository(WeatherItem);
    const weatherItem = await repository
      .createQueryBuilder('weatherItem')
      .innerJoin('weatherItem.city', 'city')
      .where(
        'LOWER(city.name) = LOWER(:cityName) AND DATE(weatherItem.createdAt) = DATE(:date)',
        {
          cityName: req.query.city_name,
          date: req.query.date,
        },
      )
      .getOne();
    if (weatherItem === null) {
      return res.status(404).json({
        error: 'Weather not found',
      });
    }

    this.redisClient.client.setEx(
      CACHE_KEY,
      CACHE_TTL,
      JSON.stringify(weatherItem),
    );

    return res.json({
      weatherItem,
    });
  }
}
