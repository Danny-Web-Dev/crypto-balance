import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
// import { LoggingService } from '@app/shared/log/log.service';
import { SharedModule } from '@app/shared/shared.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SharedModule],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}
