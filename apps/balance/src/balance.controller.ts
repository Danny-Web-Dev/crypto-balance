import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Headers,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import { Balance } from '@app/shared/interfaces/balance/balance';
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
  async get(@Headers('x-user-id') userId: string): Promise<Balance> {
    return await this.balanceService.getBalances(userId);
  }

  @Post()
  async add(
    @Headers('x-user-id') userId: string,
    @Body() body: { asset: string; amount: number },
  ): Promise<{ message: string }> {
    if (!userId) {
      this.loggingService.log(`No userId was found on x-user-id header. ${userId}`);
      throw new ServerError(ErrorType.BAD_REQUEST.message, ErrorType.BAD_REQUEST.errorCode);
    }
    await this.balanceService.addBalance(userId, body.asset, body.amount);
    return { message: 'Balance updated successfully' };
  }

  @Delete(':asset')
  async remove(@Headers('x-user-id') userId: string, @Param('asset') asset: string): Promise<void> {
    await this.balanceService.removeBalance(userId, asset);
  }

  @Post(':userId/subtract')
  async subtractBalance(
    @Param('userId') userId: string,
    @Body() body: { asset: string; amount: number },
    @Headers('X-User-ID') headerUserId: string,
  ): Promise<object | undefined> {
    if (userId !== headerUserId) {
      throw new Error('User ID mismatch');
    }
    return await this.balanceService.subtractBalance(userId, body.asset, body.amount);
  }
}
