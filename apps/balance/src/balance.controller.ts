import { Controller, Get } from '@nestjs/common';
import { BalanceService } from './balance.service';

@Controller()
export class BalanceController {
  constructor(private readonly balanceServiceService: BalanceService) {}

  @Get()
  getHello(): string {
    return this.balanceServiceService.getHello();
  }
}
