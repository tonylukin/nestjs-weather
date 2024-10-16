import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weatherController';
// import { AppService } from './app.service';

describe('AppController', () => {
  let appController: WeatherController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      // providers: [AppService],
    }).compile();

    appController = app.get<WeatherController>(WeatherController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
