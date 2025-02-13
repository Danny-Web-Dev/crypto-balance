import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { LoggingService } from './log/log.service';
import { FsUtilService } from '@app/shared/utils/fs-util.service';
import { ServerErrorExceptionFilter } from './filters/server-error-exception.filter';
import { ResponseWrapperInterceptor } from './interceptors/response-wrapper.interceptor';
import { RedisService } from '@app/shared/redis/redis.service';
import { ScheduleModule } from '@nestjs/schedule';
import { DataService } from '@app/shared/data/data.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    SharedService,
    LoggingService,
    ServerErrorExceptionFilter,
    ResponseWrapperInterceptor,
    FsUtilService,
    RedisService,
    DataService,
  ],
  exports: [
    SharedService,
    LoggingService,
    ServerErrorExceptionFilter,
    ResponseWrapperInterceptor,
    FsUtilService,
    RedisService,
    DataService,
  ],
})
export class SharedModule {}
