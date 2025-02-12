import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateController } from './rate.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared/shared.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: './apps/rate/.env',
      isGlobal: true,
    }),
    SharedModule,
  ],
  controllers: [RateController],
  providers: [RateService],
})
export class RateModule {}
