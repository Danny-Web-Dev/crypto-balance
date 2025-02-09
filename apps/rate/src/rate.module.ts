import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateController } from './rate.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [RateController],
  providers: [RateService],
})
export class RateModule {}
