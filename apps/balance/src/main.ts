import { NestFactory } from '@nestjs/core';
import { BalanceModule } from './balance.module';
import { ConfigService } from '@nestjs/config';
import { ServerErrorExceptionFilter } from '@app/shared/filters/server-error-exception.filter';
import { ResponseWrapperInterceptor } from '@app/shared/interceptors/response-wrapper.interceptor';

(async (): Promise<void> => {
  const app = await NestFactory.create(BalanceModule);
  app.useGlobalFilters(new ServerErrorExceptionFilter());
  app.useGlobalInterceptors(new ResponseWrapperInterceptor());
  const port = app.get(ConfigService).get<number>('PORT', 3001);
  app.enableCors();
  await app.listen(port);
  console.log(`Balance Service running on port ${port}`);
})()
