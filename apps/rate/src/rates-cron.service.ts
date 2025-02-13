import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggingService } from '@app/shared/log/log.service';
import { RateService } from './rate.service';
import { BalanceDataService } from '@app/shared/data/balance-data/balance-data.service';
import { UserBalances } from '@app/shared/interfaces/balance/user-balance';
import { Balance } from '@app/shared/interfaces/balance/balance';
import { Currencies } from '@app/shared/interfaces/balance/currencies';

@Injectable()
export class RatesCronService {
  constructor(
    private readonly loggingService: LoggingService,
    private readonly rateService: RateService,
    private balanceDataService: BalanceDataService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    this.loggingService.log('Fetching latest crypto rates...');
    const data = await this.balanceDataService.getAllData();
    const assets = this.extractAssetNames(data);
    const latestRates = await this.rateService.getCryptoRates(assets, true);
    Object.values(data).forEach((userBalances: Balance) => {
      Object.keys(userBalances).forEach((asset: string) => {
        if (latestRates[asset]) {
          userBalances[asset].currencies = { ...latestRates[asset] } as Currencies;
        }
      });
    });
    await this.balanceDataService.writeData(data);
    this.loggingService.log('Update assets rates successfully with latest crypto rates...');
  }

  extractAssetNames(data: UserBalances): string[] {
    const assetNames = new Set<string>();
    Object.values(data).forEach((userBalances: Balance) => {
      Object.keys(userBalances).forEach((asset: string) => assetNames.add(asset));
    });
    return [...assetNames];
  }
}
