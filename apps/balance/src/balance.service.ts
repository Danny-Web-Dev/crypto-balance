import { Injectable } from '@nestjs/common';
import { Balance } from '@app/shared/interfaces/balance/balance';
import { UserBalances } from '@app/shared/interfaces/balance/user-balance';
import { ServerError } from '@app/shared/errors/server-error';
import ErrorType from '@app/shared/errors/error-type';
import { LoggingService } from '@app/shared/log/log.service';
import { AxiosResponse } from 'axios';
import { CryptoRatesResponse } from '@app/shared/interfaces/rate/crypto-rates-response.type';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Currencies } from '@app/shared/interfaces/balance/currencies';
import { BalanceDataService } from '@app/shared/data/balance-data/balance-data.service';

@Injectable()
export class BalanceService {
  constructor(
    private readonly loggingService: LoggingService,
    private httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly balanceDataService: BalanceDataService,
  ) {}

  public async getBalances(userId: string): Promise<Balance> {
    const data = await this.balanceDataService.readData();
    return data[userId] || {};
  }

  public async addBalance(userId: string, asset: string, amount: number): Promise<Balance> {
    const data = await this.balanceDataService.readData();
    data[userId] ??= {};
    data[userId][asset] ??= { amount: 0, currencies: { usd: 0, eur: 0, gbp: 0 } };
    data[userId][asset].amount += amount;
    data[userId][asset].currencies = await this.getCoinRates(asset);
    await this.balanceDataService.writeData(data);
    this.loggingService.log(`Added balance for userId: ${userId}, asset: ${asset}, amount: ${amount}`);

    return data[userId];
  }

  public async removeBalance(userId: string, asset: string): Promise<{ userId: string }> {
    const data = await this.balanceDataService.readData();
    this.validateData(data, userId, asset);
    delete data[userId][asset];
    this.cleanEmptyBalanceUser(data, userId);
    await this.balanceDataService.writeData(data);
    this.loggingService.log(`Removed balance for userId: ${userId}, asset: ${asset}`);

    return { userId: userId };
  }

  public async updateBalance(userId: string, asset: string, amount: number): Promise<{ userId: string }> {
    const data = await this.balanceDataService.readData();
    this.validateData(data, userId, asset);
    const oldAmount = data[userId][asset].amount;
    data[userId][asset].amount = amount;
    this.cleanEmptyBalanceUser(data, userId);
    await this.balanceDataService.writeData(data);
    this.loggingService.log(`Updated balance for userId: ${userId}, asset: ${asset} from ${oldAmount} to ${amount}`);

    return { userId: userId };
  }

  private cleanEmptyBalanceUser(data: UserBalances, userId: string): void {
    if (Object.keys(data[userId]).length === 0) {
      delete data[userId];
    }
  }

  private async getCoinRates(asset: string): Promise<Currencies> {
    const url = `${this.configService.get<string>('RATES_HOST')}/rates/coin-ids?ids=${asset}`;
    try {
      const response: AxiosResponse<CryptoRatesResponse> = await lastValueFrom(
        this.httpService.get<CryptoRatesResponse>(url),
      );

      const coinData = response.data.data[asset];

      if (typeof coinData === 'object' && coinData !== null) {
        return coinData as Currencies;
      }

      return { usd: 0, eur: 0, gbp: 0 };
    } catch (error) {
      this.loggingService.error(`Unable to fetch data from url: ${url}, details: ${error}`);
      throw new ServerError(ErrorType.INTERNAL_SERVER_ERROR.message, ErrorType.INTERNAL_SERVER_ERROR.errorCode);
    }
  }

  private validateData(data: UserBalances, userId: string, asset: string): void {
    if (!data[userId]) {
      throw new ServerError(ErrorType.USER_DOES_NOT_EXIST.message, ErrorType.USER_DOES_NOT_EXIST.errorCode);
    }
    if (!data[userId][asset]) {
      throw new ServerError(ErrorType.ASSET_NOT_FOUND.message, ErrorType.ASSET_NOT_FOUND.errorCode);
    }
  }
}
