import { Controller, Get } from '@nestjs/common';
import { RateService } from './rate.service';

@Controller('rates')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  async getCryptoRates(): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.rateService.getCryptoRates(['1']);
  }
}
