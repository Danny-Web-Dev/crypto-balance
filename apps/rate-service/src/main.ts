import { NestFactory } from '@nestjs/core';
import { RateServiceModule } from './rate-service.module';
import { ConfigService } from '@nestjs/config';

(async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(RateServiceModule);
  const port = app.get(ConfigService).get<number>('PORT', 3002);
  app.enableCors();
  await app.listen(3002);
  console.log(`Rate Service running on port ${port}`);
})();
