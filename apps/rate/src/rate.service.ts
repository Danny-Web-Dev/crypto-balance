import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { CryptoRatesResponse } from '../types/crypto-rates-response.type';
import { ServerError } from '@app/shared/errors/server-error';
import ErrorType from '@app/shared/errors/error-type';

@Injectable()
export class RateService {
  private redis: Redis;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
    });
  }

  async getCryptoRates(cryptoIds: string[]): Promise<CryptoRatesResponse> {
    const cacheKey = `crypto_rates:${cryptoIds.join(',')}`;
    const cachedRates = await this.redis.get(cacheKey);

    if (cachedRates) {
      return JSON.parse(cachedRates) as CryptoRatesResponse;
    }

    const url = `${this.configService.get<string>('CG_BASE_URL')}/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=usd,eur`;

    try {
      const response: AxiosResponse<CryptoRatesResponse> = await lastValueFrom(
        this.httpService.get<CryptoRatesResponse>(url),
      );

      if (response.data) {
        await this.redis.set(cacheKey, JSON.stringify(response.data), 'EX', 300); // Cache expires in 5 minutes
        return response.data;
      }
      throw new ServerError(ErrorType.GENERAL_ERROR.message, ErrorType.GENERAL_ERROR.errorCode);
    } catch (error: any) {
      console.error(error);
      throw new ServerError(ErrorType.GENERAL_ERROR.message, ErrorType.GENERAL_ERROR.errorCode);
    }
  }

  async getCryptoList(): Promise<CryptoRatesResponse> {
    const cacheKey = 'crypto_rates:all';
    const cachedRates = await this.redis.get(cacheKey);

    if (cachedRates) {
      return JSON.parse(cachedRates) as CryptoRatesResponse;
    }

    const url = `${this.configService.get<string>('CG_BASE_URL')}/coins/list`;

    try {
      const response: AxiosResponse<CryptoRatesResponse> = await lastValueFrom(
        this.httpService.get<CryptoRatesResponse>(url),
      );

      if (response.data) {
        await this.redis.set(cacheKey, JSON.stringify(response.data), 'EX', 300);
        return response.data;
      }
      throw new Error('No data returned from CoinGecko API');
    } catch (error) {
      throw new Error(`Error fetching all rates: ${error.message}`);
    }
  }
}
