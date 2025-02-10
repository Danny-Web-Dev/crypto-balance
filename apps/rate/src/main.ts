import { NestFactory } from '@nestjs/core';
import { RateModule } from './rate.module';
import { ConfigService } from '@nestjs/config';
import { wrapResponse } from '@app/shared';

(async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(RateModule);
  const port = app.get(ConfigService).get<number>('PORT', 3002);
  app.enableCors();
  app.use(wrapResponse);
  await app.listen(port);
  console.log(`Rate Service running on port ${port}`);
})();
