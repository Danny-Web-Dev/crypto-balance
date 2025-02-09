import { NestFactory } from '@nestjs/core';
import { RateModule } from './rate.module';
import { ConfigService } from '@nestjs/config';

(async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(RateModule);
  const port = app.get(ConfigService).get<number>('PORT', 3002);
  app.enableCors();
  await app.listen(port);
  console.log(`Rate Service running on port ${port}`);
})();
