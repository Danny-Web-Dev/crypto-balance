import { Controller, Get, Query } from '@nestjs/common';
import { RateService } from './rate.service';
import { CryptoRatesResponse } from '../types/crypto-rates-response.type';

@Controller('rates')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  async getCryptoRates(@Query('ids') ids: string): Promise<CryptoRatesResponse> {
    const cryptoIds = ids.split(',');
    return await this.rateService.getCryptoRates(cryptoIds);
  }
}
