import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}
