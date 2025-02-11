import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BalanceController } from './controllers/balance.controller';
import { BalanceService } from './services/balance.service';
import { LoggingService } from '@app/shared/log/log.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [BalanceController],
  providers: [BalanceService, LoggingService],
})
export class BalanceModule {}
