import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggingService } from '@app/shared/log/log.service';
import { RateService } from './rate.service';
import { BalanceDataService } from '@app/shared/data/balance-data/balance-data.service';
import { UserBalances } from '@app/shared/interfaces/balance/user-balance';
import { Balance } from '@app/shared/interfaces/balance/balance';
import { Currencies } from '@app/shared/interfaces/balance/currencies';
import { CryptoRatesResponse } from '@app/shared/interfaces/rate/crypto-rates-response.type';

@Injectable()
export class RatesCronService {
  constructor(
    private readonly loggingService: LoggingService,
    private readonly rateService: RateService,
    private balanceDataService: BalanceDataService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron(): Promise<void> {
    this.loggingService.log('Fetching latest crypto rates.');

    try {
      const data = await this.balanceDataService.getAllData();
      if (!data || Object.keys(data).length === 0) {
        return this.loggingService.log('No balance data available.');
      }

      const assets = this.extractAssetNames(data);
      if (assets.length === 0) {
        return this.loggingService.log('No assets found.');
      }

      const latestRates = await this.rateService.getCryptoRates(assets, true);
      this.updateUserBalancesWithRates(data, latestRates);

      await this.balanceDataService.writeData(data);
      this.loggingService.log('Updated asset rates successfully with the latest crypto rates.');
    } catch (error) {
      this.loggingService.error(`Cron job failed: ${error.message}`);
    }
  }

  private updateUserBalancesWithRates(data: UserBalances, latestRates: CryptoRatesResponse): void {
    Object.values(data).forEach((userBalances: Balance) => {
      Object.entries(userBalances).forEach(([asset, balance]) => {
        if (latestRates[asset]) {
          balance.currencies = { ...latestRates[asset] } as Currencies;
        }
      });
    });
  }

  extractAssetNames(data: UserBalances): string[] {
    const assetNames = new Set<string>();
    Object.values(data).forEach((userBalances: Balance) => {
      Object.keys(userBalances).forEach((asset: string) => assetNames.add(asset));
    });
    return [...assetNames];
  }
}
