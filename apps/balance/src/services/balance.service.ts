import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Balance } from '../interfaces/balance';
import { UserBalances } from '../interfaces/user-balance';
import { ServerError } from '@app/shared/errors/server-error';
import ErrorType from '@app/shared/errors/error-type';

// Interfaces

// Service
@Injectable()
export class BalanceService {
  private readonly filePath = join(
    __dirname,
    '../../../libs/shared/src/data/balances.json',
  );

  private readData(): UserBalances {
    try {
      if (!existsSync(this.filePath)) return {} as UserBalances;
      return JSON.parse(readFileSync(this.filePath, 'utf8')) as UserBalances;
    } catch (error: any) {
      console.error(error);
      throw new ServerError(
        ErrorType.GENERAL_ERROR.message,
        ErrorType.GENERAL_ERROR.errorCode,
      );
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
    const data = this.readData();
    console.log(data);
    data[userId] = data[userId] || {};
    data[userId][asset] = (data[userId][asset] || 0) + amount;
    this.writeData(data);
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
