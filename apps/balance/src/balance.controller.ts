import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { Balance } from '@app/shared/interfaces/balance/balance';

@Controller('balances')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  async get(@Headers('x-user-id') userId: string): Promise<Balance> {
    return await this.balanceService.getBalances(userId);
  }

  @Post()
  async add(
    @Headers('x-user-id') userId: string,
    @Body() body: { asset: string; amount: number },
  ): Promise<{ message: string; userId: string }> {
    await this.balanceService.addBalance(userId, body.asset, body.amount);
    return { userId: userId, message: `Added balance` };
  }

  @Delete(':asset')
  async remove(@Headers('x-user-id') userId: string, @Param('asset') asset: string): Promise<{ userId: string }> {
    await this.balanceService.removeBalance(userId, asset);
    return { userId: userId };
  }

  @Put('/update')
  async updateBalance(
    @Body() body: { asset: string; amount: number },
    @Headers('X-User-ID') userId: string,
  ): Promise<{ userId: string }> {
    await this.balanceService.updateBalance(userId, body.asset, body.amount);
    return { userId: userId };
  }
}
