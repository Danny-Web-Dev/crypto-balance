import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BalanceServiceController } from './balance-service.controller';
import { BalanceServiceService } from './balance-service.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [BalanceServiceController],
  providers: [BalanceServiceService],
})
export class BalanceServiceModule {}
