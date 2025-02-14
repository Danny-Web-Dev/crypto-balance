import { Test, TestingModule } from '@nestjs/testing';
import { RateService } from '../src/rate.service';
import { LoggingService } from '@app/shared/log/log.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@app/shared/redis/redis.service';
import { ServerError } from '@app/shared/errors/server-error';
import { jest } from '@jest/globals';
import { CryptoRatesResponse } from '@app/shared/interfaces/rate/crypto-rates-response.type';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('RateService', (): void => {
  let rateService: RateService;
  let httpService: jest.Mocked<HttpService>;
  let redisService: jest.Mocked<RedisService>;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateService,
        {
          provide: LoggingService,
          useValue: { log: jest.fn(), error: jest.fn(), warn: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('http://mock-rates-host') },
        },
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
        {
          provide: RedisService,
          useValue: { get: jest.fn(), set: jest.fn() },
        },
      ],
    }).compile();

    rateService = module.get<RateService>(RateService);
    httpService = module.get(HttpService);
    redisService = module.get(RedisService);
  });

  // Get crypto rates - cached
  it('should return cached crypto rates', async (): Promise<void> => {
    const mockRates: CryptoRatesResponse = { BTC: { usd: 50000, eur: 46000 } };

    const getSpy = jest.spyOn(redisService, 'get').mockResolvedValueOnce(JSON.stringify(mockRates));

    const result = await rateService.getCryptoRates(['BTC']);

    expect(result).toEqual(mockRates);
    expect(getSpy).toHaveBeenCalledWith('crypto_rates:BTC');
  });

  // Get crypto rates - fresh fetch
  it('should fetch and cache crypto rates if not cached', async (): Promise<void> => {
    const mockRates: CryptoRatesResponse = { BTC: { usd: 50000, eur: 46000 } };

    // Wrapping redisService.get with jest.spyOn to simulate cache miss
    const getSpy = jest.spyOn(redisService, 'get').mockResolvedValueOnce(null);
    const setSpy = jest.spyOn(redisService, 'set').mockResolvedValueOnce(undefined);

    httpService.get.mockReturnValueOnce(of({ data: mockRates } as AxiosResponse));

    const result = await rateService.getCryptoRates(['BTC']);

    expect(result).toEqual(mockRates);
    expect(getSpy).toHaveBeenCalledWith('crypto_rates:BTC');
    expect(setSpy).toHaveBeenCalledWith('crypto_rates:BTC', JSON.stringify(mockRates), 300);
  });

  it('should throw an error when fetching crypto rates fails', async (): Promise<void> => {
    redisService.get.mockResolvedValueOnce(null); // Simulate cache miss
    httpService.get.mockReturnValueOnce(of({ data: null } as AxiosResponse<any>)); // Simulate API returning null data

    await expect(rateService.getCryptoRates(['BTC'])).rejects.toThrow(ServerError);
  });

  it('should handle cache retrieval failure gracefully', async (): Promise<void> => {
    redisService.get.mockRejectedValueOnce(new Error('Cache error'));
    httpService.get.mockReturnValueOnce(of({ data: { BTC: { usd: 50000 } } } as AxiosResponse));

    const result = await rateService.getCryptoRates(['BTC']);

    expect(result).toEqual({ BTC: { usd: 50000 } });
  });
});
