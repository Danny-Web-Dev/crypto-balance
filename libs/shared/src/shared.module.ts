import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { LoggingService } from '@app/shared/log/log.service';

@Module({
  providers: [SharedService],
  exports: [SharedService, LoggingService],
})
export class SharedModule {}
