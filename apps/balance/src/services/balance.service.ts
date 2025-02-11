import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Balance } from '@app/shared/interfaces/balance/balance';
import { UserBalances } from '@app/shared/interfaces/balance/user-balance';
import { ServerError } from '@app/shared/errors/server-error';
import ErrorType from '@app/shared/errors/error-type';
import { LoggingService } from '@app/shared/log/log.service';

@Injectable()
export class BalanceService {
  constructor(private readonly loggingService: LoggingService) {}
  private readonly filePath = join(
    __dirname,
    '../../../libs/shared/src/data/balances.json',
  );

  private readData(): UserBalances {
    if (!existsSync(this.filePath)) {
      this.loggingService.log(`File: ${this.filePath} does not exist`);
      return {} as UserBalances;
    }
    try {
      return JSON.parse(readFileSync(this.filePath, 'utf8')) as UserBalances;
    } catch (error: any) {
      console.error(error);
      throw new ServerError(ErrorType.GENERAL_ERROR.message, ErrorType.GENERAL_ERROR.errorCode);
    }
  }

  private writeData(data: UserBalances): void {
    writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  getBalances(userId: string): Balance {
    const data = this.readData();
    return data[userId] || {};
  }

  addBalance(userId: string, asset: string, amount: number): void {
    this.loggingService.log(`Adding balance for userId: ${userId}`);
    try {
      const data = this.readData();
      data[userId] = data[userId] || {};
      data[userId][asset] = (data[userId][asset] || 0) + amount;
      return this.writeData(data);
    } catch (error: any) {
      console.error(error);
      throw new ServerError('test', 1234);
    }
  }

  removeBalance(userId: string, asset: string): void {
    const data = this.readData();
    if (data[userId]) {
      delete data[userId][asset];
      if (Object.keys(data[userId]).length === 0) delete data[userId];
      this.writeData(data);
    }
  }
}
