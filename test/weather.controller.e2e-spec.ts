import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { response } from 'express';

describe('WeatherController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'user1',
        password: '123456',
      })
      .expect(201)
      .then((response) => {
        token = response.body.access_token;
      });
  });

  it(`/GET weather/find`, () => {
    console.log(`token: ${token}`);
    return request(app.getHttpServer())
      .get('/weather/find')
      .auth(token, { type: 'bearer' })
      .query({ city_name: 'moscow', date: '2024-08-01' })
      .expect(200)
      .expect({
        weatherItem: {
          id: 68,
          weather: 'Rainy',
          createdAt: '2024-08-01T07:00:00.000Z',
        },
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
