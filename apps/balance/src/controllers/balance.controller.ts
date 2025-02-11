import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Headers,
} from '@nestjs/common';
import { BalanceService } from '../services/balance.service';
import { Balance } from '../interfaces/balance';
import { ServerError } from '@app/shared/errors/server-error';
import { ERROR_PREFIX } from '@nestjs/cli/lib/ui';
import ErrorType from '@app/shared/errors/error-type';

@Controller('balances')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  getBalances(@Headers() headers: Record<string, string>): Balance {
    const userId = headers['x-user-id']; // Extract header manually
    return this.balanceService.getBalances(userId);
  }

  @Post()
  addBalance(
    @Headers() headers: Record<string, string>,
    @Body() body: { asset: string; amount: number },
  ) {
    const userId = headers['x-user-id']; // Extract header manually

    console.log(userId);
    if (!userId) {
      console.error();
      throw new ServerError(ErrorType.BAD_REQUEST.message, ErrorType.BAD_REQUEST.errorCode);
    }

    this.balanceService.addBalance(userId, body.asset, body.amount);
    return { message: 'Balance updated successfully' };
  }

  @Delete(':asset')
  removeBalance(
    @Headers() headers: Record<string, string>,
    @Param('asset') asset: string,
  ) {
    const userId = headers['x-user-id']; // Extract header manually

    this.balanceService.removeBalance(userId, asset);
    return { message: 'Balance removed successfully' };
  }
}
