import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RateServiceController } from './rate-service.controller';
import { RateServiceService } from './rate-service.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [RateServiceController],
  providers: [RateServiceService],
})
export class RateServiceModule {}
