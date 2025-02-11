import { Controller, Get, Query } from '@nestjs/common';
import { RateService } from './rate.service';
import { CryptoRatesResponse } from '@app/shared/interfaces/rate/crypto-rates-response.type';
import { CryptoDetails } from '@app/shared/interfaces/rate/crypto-details';

@Controller('rates')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get('by-ids')
  async getCryptoRatesById(
    @Query('ids') ids: string,
  ): Promise<CryptoRatesResponse> {
    const cryptoIds = ids.split(',');
    return await this.rateService.getCryptoRates(cryptoIds);
  }

  @Get('all')
  async getCryptoRatesByCurrency(
    @Query('currency') currency: string,
  ): Promise<CryptoDetails[]> {
    currency = currency || 'usd';
    return await this.rateService.getAllCryptoRatesByCurrency(currency);
  }
}
