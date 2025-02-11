import { NestFactory } from '@nestjs/core';
import { RateModule } from './rate.module';
import { ConfigService } from '@nestjs/config';
import { ServerErrorExceptionFilter } from '@app/shared/filters/server-error-exception.filter';
import { ResponseWrapperInterceptor } from '@app/shared/interceptors/response-wrapper.interceptor'


(async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(RateModule);
  app.useGlobalFilters(new ServerErrorExceptionFilter());
  app.useGlobalInterceptors(new ResponseWrapperInterceptor());
  const port = app.get(ConfigService).get<number>('PORT', 3002);
  app.enableCors();
  await app.listen(port);
  console.log(`Rate Service running on port ${port}`);
})();
