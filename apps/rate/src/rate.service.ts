import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { CryptoRatesResponse } from '@app/shared/interfaces/rate/crypto-rates-response.type';
import { ServerError } from '@app/shared/errors/server-error';
import ErrorType from '@app/shared/errors/error-type';
import { CryptoDetails } from '@app/shared/interfaces/rate/crypto-details';

@Injectable()
export class RateService {
  private readonly url: string | undefined;
  private redis: Redis;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
    });
    this.url = configService.get<string>('CG_BASE_URL');
    if (!this.url) {
      throw new ServerError(
        ErrorType.GENERAL_ERROR.message,
        ErrorType.GENERAL_ERROR.errorCode,
      );
    }
  }

  async getCryptoRates(cryptoIds: string[]): Promise<CryptoRatesResponse> {
    const cacheKey = `crypto_rates:${cryptoIds.join(',')}`;
    const cachedRates = await this.redis.get(cacheKey);

    if (cachedRates) {
      return JSON.parse(cachedRates) as CryptoRatesResponse;
    }
    const url = `${this.url}/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=usd,eur`;
    try {
      const response: AxiosResponse<CryptoRatesResponse> = await lastValueFrom(
        this.httpService.get<CryptoRatesResponse>(url),
      );

      if (response.data) {
        await this.redis.set(cacheKey, JSON.stringify(response.data),'EX',300,); // Cache expires in 5 minutes
      }
      return response.data;
    } catch (error: any) {
      console.error(error);
      throw new ServerError(
        ErrorType.GENERAL_ERROR.message,
        ErrorType.GENERAL_ERROR.errorCode,
      );
    }
  }

  async getAllCryptoRatesByCurrency(currency: string): Promise<CryptoDetails[]> {
    const url = `${this.url}/coins/markets?vs_currency=${currency}`;

    try {
      const response: AxiosResponse<CryptoDetails[]> = await lastValueFrom(
        this.httpService.get<CryptoDetails[]>(url),
      );

      return response.data;
    } catch (error) {
      console.error(error);
      throw new ServerError(
        ErrorType.GENERAL_ERROR.message,
        ErrorType.GENERAL_ERROR.errorCode,
      );
    }
  }
}
