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
import ErrorType from '@app/shared/errors/error-type';
import { LoggingService } from '@app/shared/log/log.service';

@Controller('balances')
export class BalanceController {
  constructor(
    private readonly balanceService: BalanceService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  getBalances(@Headers('x-user-id') userId: string): Balance {
    return this.balanceService.getBalances(userId);
  }

  @Post()
  addBalance(@Headers('x-user-id') userId: string, @Body() body: { asset: string; amount: number }) {
    if (!userId) {
      this.loggingService.log(`No userId was found on x-user-id header. ${userId}`);
      throw new ServerError(ErrorType.BAD_REQUEST.message, ErrorType.BAD_REQUEST.errorCode);
    }
    this.balanceService.addBalance(userId, body.asset, body.amount);
    return { message: 'Balance updated successfully' };
  }

  @Delete(':asset')
  removeBalance(@Headers('x-user-id') userId: string, @Param('asset') asset: string) {
    this.balanceService.removeBalance(userId, asset);
    return { message: 'Balance removed successfully' };
  }
}
