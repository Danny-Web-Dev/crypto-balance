import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { LoggingService } from './log/log.service';
import { FsUtilService } from '@app/shared/utils/fs-util.service';
import { ServerErrorExceptionFilter } from './filters/server-error-exception.filter';
import { ResponseWrapperInterceptor } from './interceptors/response-wrapper.interceptor';

@Module({
  providers: [SharedService, LoggingService, ServerErrorExceptionFilter, ResponseWrapperInterceptor, FsUtilService],
  exports: [SharedService, LoggingService, ServerErrorExceptionFilter, ResponseWrapperInterceptor, FsUtilService],
})
export class SharedModule {}
