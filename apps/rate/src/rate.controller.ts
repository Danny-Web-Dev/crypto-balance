import { Controller, Get, Query } from '@nestjs/common';
import { RateService } from './rate.service';
import { CryptoRatesResponse } from '@app/shared/interfaces/rate/crypto-rates-response.type';

@Controller()
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get('coin-ids')
  async getCryptoRatesById(@Query('ids') ids: string): Promise<CryptoRatesResponse> {
    const cryptoIds = ids.split(',');
    return await this.rateService.getCryptoRates(cryptoIds);
  }
}
