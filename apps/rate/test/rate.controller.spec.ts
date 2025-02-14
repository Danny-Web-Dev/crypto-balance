import { Test, TestingModule } from '@nestjs/testing';
import { RateController } from '../src/rate.controller';
import { RateService } from '../src/rate.service';
import { CryptoRatesResponse } from '@app/shared/interfaces/rate/crypto-rates-response.type';

describe('RateController', () => {
  let controller: RateController;

  const mockRateService = {
    getCryptoRates: jest.fn().mockResolvedValue({
      bitcoin: { usd: 50000, eur: 46000, gbp: 39000 },
      ethereum: { usd: 4000, eur: 3700, gbp: 3000 },
    } as CryptoRatesResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RateController],
      providers: [{ provide: RateService, useValue: mockRateService }],
    }).compile();

    controller = module.get<RateController>(RateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return crypto rates by ids', async () => {
    const ids = 'bitcoin,ethereum';
    const result = await controller.getCryptoRatesById(ids);

    expect(result).toEqual({
      bitcoin: { usd: 50000, eur: 46000, gbp: 39000 },
      ethereum: { usd: 4000, eur: 3700, gbp: 3000 },
    });
    expect(mockRateService.getCryptoRates).toHaveBeenCalledWith(['bitcoin', 'ethereum']);
  });
});
