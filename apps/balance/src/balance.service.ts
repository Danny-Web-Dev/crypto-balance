import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { Balance } from '@app/shared/interfaces/balance/balance';
import { UserBalances } from '@app/shared/interfaces/balance/user-balance';
import { ServerError } from '@app/shared/errors/server-error';
import ErrorType from '@app/shared/errors/error-type';
import { LoggingService } from '@app/shared/log/log.service';
import { FsUtilService } from '@app/shared/utils/fs-util.service';

@Injectable()
export class BalanceService {
  constructor(
    private readonly loggingService: LoggingService,
    private fsUtilService: FsUtilService,
  ) {}

  private readonly filePath = join(__dirname, '../../../libs/shared/src/data/balances.json');

  private async readData(): Promise<UserBalances> {
    if (!(await this.fsUtilService.fileExists(this.filePath))) {
      this.loggingService.log(`File: ${this.filePath} does not exist`);
      return {} as UserBalances;
    }
    try {
      return await this.fsUtilService.readFile<UserBalances>(this.filePath);
    } catch (error: any) {
      this.loggingService.error<any>(error);
      throw new ServerError(ErrorType.GENERAL_ERROR.message, ErrorType.GENERAL_ERROR.errorCode);
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
      await this.fsUtilService.writeData<UserBalances>(this.filePath, data);
      this.loggingService.log(`Added balance for userId: ${userId}, asset: ${asset}, amount: ${amount}`);
    } catch (error: any) {
      this.loggingService.error<any>(error);
      throw new ServerError(ErrorType.GENERAL_ERROR.message, ErrorType.GENERAL_ERROR.errorCode);
    }
  }

  async removeBalance(userId: string, asset: string): Promise<void> {
    try {
      const data = await this.readData();
      if (data[userId]) {
        delete data[userId][asset];
        this.cleanNoBalanceUser(data, userId);
        await this.fsUtilService.writeData<UserBalances>(this.filePath, data);
        this.loggingService.log(`Removed balance for userId: ${userId}, asset: ${asset}`);
      }
    } catch (error: any) {
      this.loggingService.error<any>(error);
      throw new ServerError(ErrorType.GENERAL_ERROR.message, ErrorType.GENERAL_ERROR.errorCode);
    }
  }

  async updateBalance(userId: string, asset: string, amount: number): Promise<void> {
    try {
      const data = await this.readData();
      if (data[userId] && data[userId][asset]) {
        const oldAmount = data[userId][asset];
        data[userId][asset] = amount;
        this.cleanNoBalanceUser(data, userId);
        await this.fsUtilService.writeData<UserBalances>(this.filePath, data);
        this.loggingService.log(`${asset} balance was updated successfully from ${oldAmount} to ${amount}`);
      }
    } catch (error: any) {
      console.error(error);
      throw new ServerError(ErrorType.GENERAL_ERROR.message, ErrorType.GENERAL_ERROR.errorCode);
    }
  }

  cleanNoBalanceUser(data: UserBalances, userId: string): void {
    if (Object.keys(data[userId]).length === 0) {
      delete data[userId];
    }
  }

}
