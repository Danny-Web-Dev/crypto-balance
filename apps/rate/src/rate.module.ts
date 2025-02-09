import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [RateController],
  providers: [RateService],
})
export class RateModule {}
