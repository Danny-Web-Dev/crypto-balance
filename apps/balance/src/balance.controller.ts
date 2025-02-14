import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { Balance } from '@app/shared/interfaces/balance/balance';

@Controller()
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  public async get(@Headers('x-user-id') userId: string): Promise<Balance> {
    return await this.balanceService.getBalances(userId);
  }

  @Post('add')
  public async add(
    @Headers('x-user-id') userId: string,
    @Body() body: { asset: string; amount: number },
  ): Promise<Balance> {
    return await this.balanceService.addBalance(userId, body.asset, body.amount);
  }

  @Delete(':asset')
  public async remove(@Headers('x-user-id') userId: string, @Param('asset') asset: string): Promise<{ userId: string }> {
    return await this.balanceService.removeBalance(userId, asset);
  }

  @Put('/update')
  public async updateBalance(
    @Body() body: { asset: string; amount: number },
    @Headers('x-user-id') userId: string,
  ): Promise<{ userId: string }> {
    return await this.balanceService.updateBalance(userId, body.asset, body.amount);
  }
}
