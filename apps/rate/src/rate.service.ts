import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RateService {
  private redis: Redis;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Initialize Redis connection
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    this.redis = new Redis({
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
    });
  }

  async getCryptoRates(cryptoIds: string[]): Promise<any> {
    const cacheKey = `crypto_rates:${cryptoIds.join(',')}`;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const cachedRates = await this.redis.get(cacheKey);

    if (cachedRates) {
      console.log('Fetching from cache');
      return JSON.parse(cachedRates);
    }

    console.log('Fetching from CoinGecko');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=usd`;

    try {
      // Use lastValueFrom to convert the Observable to a Promise
      const response = await lastValueFrom(this.httpService.get(url));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const rates = response.data;

      // Cache the response in Redis for 5 minutes
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      await this.redis.set(cacheKey, JSON.stringify(rates), 'EX', 300); // Cache expires in 300 seconds (5 minutes)

      return rates;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Error fetching rates: ${error.message}`);
    }
  }
}
