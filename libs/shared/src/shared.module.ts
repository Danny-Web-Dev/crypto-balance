import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { LoggingService } from './log/log.service';
import { ServerErrorExceptionFilter } from './filters/server-error-exception.filter';
import { ResponseWrapperInterceptor } from './interceptors/response-wrapper.interceptor';

@Module({
  providers: [SharedService, LoggingService, ServerErrorExceptionFilter, ResponseWrapperInterceptor],
  exports: [SharedService, LoggingService, ServerErrorExceptionFilter, ResponseWrapperInterceptor],
})
export class SharedModule {}
