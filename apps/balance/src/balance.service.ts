import { Injectable } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
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

  private async readData(): Promise<UserBalances> {
    if (!(await this.fileExists())) {
      this.loggingService.log(`File: ${this.filePath} does not exist`);
      return {} as UserBalances;
    }
    try {
      const fileData = await fsPromises.readFile(this.filePath, 'utf8');
      return JSON.parse(fileData) as UserBalances;
    } catch (error: any) {
      console.error(error);
      throw new ServerError(ErrorType.GENERAL_ERROR.message, ErrorType.GENERAL_ERROR.errorCode);
    }
  }

  private async writeData(data: UserBalances): Promise<void> {
    try {
      await fsPromises.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error: any) {
      console.error(error);
      throw new ServerError(ErrorType.GENERAL_ERROR.message, ErrorType.GENERAL_ERROR.errorCode);
    }
  }

  private async fileExists(): Promise<boolean> {
    try {
      await fsPromises.access(this.filePath);
      return true;
    } catch {
      return false;
    }
  }

  async getBalances(userId: string): Promise<Balance> {
    const data = await this.readData();
    return data[userId] || {};
  }

  async addBalance(userId: string, asset: string, amount: number): Promise<void> {

    try {
      const data = await this.readData();
      data[userId] = data[userId] || {};
      data[userId][asset] = (data[userId][asset] || 0) + amount;
      await this.writeData(data);
      this.loggingService.log(`Added balance for userId: ${userId}, asset: ${asset}, amount: ${amount}`);
    } catch (error: any) {
      console.error(error);
      throw new ServerError(ErrorType.GENERAL_ERROR.message, ErrorType.GENERAL_ERROR.errorCode);
    }
  }

  async removeBalance(userId: string, asset: string): Promise<void> {
    const data = await this.readData();
    if (data[userId]) {
      delete data[userId][asset];
      if (Object.keys(data[userId]).length === 0) delete data[userId];
      await this.writeData(data);
      this.loggingService.log(`Removed balance for userId: ${userId}, asset: ${asset}`);
    }
  }

  async subtractBalance(userId: string, asset: string, amount: number): Promise<object | undefined> {
    try {
      const data = await this.readData();
      if (data[userId] && data[userId][asset]) {
        const oldAmount = data[userId][asset];
        data[userId][asset] -= amount;
        if (data[userId][asset] === 0) {
          delete data[userId][asset];
        }
        if (Object.keys(data[userId]).length === 0) {
          delete data[userId];
        }
        await this.writeData(data);
        this.loggingService.log(`$\{asset} was subtracted successfully. from ${oldAmount} to ${oldAmount - amount}`);
        return {message: `asset: ${asset} was subtracted successfully.`};
      }
    } catch (error: any) {
      console.error(error);
      throw new ServerError(ErrorType.GENERAL_ERROR.message, ErrorType.GENERAL_ERROR.errorCode);
    }
  }
}
