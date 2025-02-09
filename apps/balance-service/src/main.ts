import { NestFactory } from '@nestjs/core';
import { BalanceServiceModule } from './balance-service.module';
import { ConfigService } from '@nestjs/config';

(async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(BalanceServiceModule);
  const port = app.get(ConfigService).get<number>('PORT', 3001);
  app.enableCors();
  await app.listen(port);
  console.log(`Balance Service running on port ${port}`);
})();
