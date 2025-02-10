import { Controller, Get } from '@nestjs/common';
import { RateService } from './rate.service';
import { CryptoRatesResponse } from '../types/crypto-rates-response.type';

@Controller('rates')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get('list')
  async getCryptoList(): Promise<CryptoRatesResponse> {
    return await this.rateService.getCryptoList();
  }
  @Get()
  async getCryptoRates(): Promise<CryptoRatesResponse> {
    return await this.rateService.getCryptoRates(['bitcoin', 'cardano']);
  }
}
