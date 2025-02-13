import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { CryptoRatesResponse } from '@app/shared/interfaces/rate/crypto-rates-response.type';
import { ServerError } from '@app/shared/errors/server-error';
import ErrorType from '@app/shared/errors/error-type';
import { LoggingService } from '@app/shared/log/log.service';
import { RedisService } from '@app/shared/redis/redis.service';

@Injectable()
export class RateService {

  private url: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly loggingService: LoggingService,
    private readonly redisService: RedisService,
  ) {
    this.init();
  }

  init(): void {
    this.url = this.configService.get<string>('CG_BASE_URL');
    if (!this.url) {
      this.loggingService.error('Could not find CoinGecko url');
      throw new ServerError(ErrorType.GENERAL_ERROR.message, ErrorType.GENERAL_ERROR.errorCode);
    }
  }

  async getCryptoRates(cryptoIds: string[], forceCG: boolean = false): Promise<CryptoRatesResponse> {
    const cacheKey = `crypto_rates:${cryptoIds.join(',')}`;

    if (!forceCG) {
      const cachedRates = await this.redisService.get(cacheKey);
      if (cachedRates) {
        return JSON.parse(cachedRates) as CryptoRatesResponse;
      }
    }

    const url = `${this.url}/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=usd,eur`;
    try {
      const response: AxiosResponse<CryptoRatesResponse> = await lastValueFrom(
        this.httpService.get<CryptoRatesResponse>(url),
      );

      if (response.data) {
        await this.redisService.set(cacheKey, JSON.stringify(response.data), 300);
      }
      return response.data;
    } catch (error: any) {
      this.loggingService.error(error);
      throw new ServerError(ErrorType.GENERAL_ERROR.message, ErrorType.GENERAL_ERROR.errorCode);
    }
  }
}
