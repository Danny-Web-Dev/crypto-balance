import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { FsUtilService } from '@app/shared/utils/fs-util.service';
import { UserBalances } from '@app/shared/interfaces/balance/user-balance';
import { ServerError } from '@app/shared/errors/server-error';
import ErrorType from '@app/shared/errors/error-type';
import { LoggingService } from '@app/shared/log/log.service';
@Injectable()
export class BalanceDataService {
  constructor(
    private fsUtilService: FsUtilService,
    private readonly loggingService: LoggingService,
  ) {}

  private readonly filePath = join(__dirname, '../../../libs/shared/src/data/balance-data/balances.json');

  async getAllData(): Promise<UserBalances> {
    return await this.fsUtilService.readFile<UserBalances>(this.filePath);
  }

  async readData(): Promise<UserBalances> {
    try {
      return await this.fsUtilService.readFile<UserBalances>(this.filePath);
    } catch (error: any) {
      this.loggingService.error(error);
      throw new ServerError(ErrorType.INTERNAL_SERVER_ERROR.message, ErrorType.INTERNAL_SERVER_ERROR.errorCode);
    }
  }

  async writeData(data: UserBalances): Promise<void> {
    try {
      await this.fsUtilService.writeData<UserBalances>(this.filePath, data);
    } catch (error) {
      this.loggingService.error(error);
      throw new ServerError(ErrorType.INTERNAL_SERVER_ERROR.message, ErrorType.INTERNAL_SERVER_ERROR.errorCode);
    }
  }
}
