import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from '../src/balance.controller';
import { BalanceService } from '../src/balance.service';
import { Balance } from '@app/shared/interfaces/balance/balance';

describe('BalanceController', (): void => {
  let controller: BalanceController;

  const mockBalanceService = {
    getBalances: jest.fn().mockResolvedValue({
      bitcoin: { amount: 1.5, currencies: { usd: 50000, eur: 46000, gbp: 39000 } },
    } as Balance),
    addBalance: jest.fn().mockResolvedValue({
      bitcoin: { amount: 2, currencies: { usd: 60000, eur: 55000, gbp: 48000 } },
    } as Balance),
    removeBalance: jest.fn().mockResolvedValue({ userId: '123' }),
    updateBalance: jest.fn().mockResolvedValue({ userId: '123' }),
  };

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [{ provide: BalanceService, useValue: mockBalanceService }],
    }).compile();

    controller = module.get<BalanceController>(BalanceController);
  });

  it('should be defined', (): void => {
    expect(controller).toBeDefined();
  });

  it('should get balances', async (): Promise<void> => {
    const result = await controller.get('1');
    expect(result).toEqual({
      bitcoin: {
        amount: 1.5,
        currencies: { usd: 50000, eur: 46000, gbp: 39000 },
      },
    });
    expect(mockBalanceService.getBalances).toHaveBeenCalledWith('1');
  });

  it('should add a balance', async (): Promise<void> => {
    const result = await controller.add('1', { asset: 'bitcoin', amount: 1 });
    expect(result).toEqual({
      bitcoin: {
        amount: 2,
        currencies: { usd: 60000, eur: 55000, gbp: 48000 },
      },
    });
    expect(mockBalanceService.addBalance).toHaveBeenCalledWith('1', 'bitcoin', 1);
  });

  it('should remove a balance', async (): Promise<void> => {
    const result = await controller.remove('123', 'bitcoin');
    expect(result).toEqual({ userId: '123' });
    expect(mockBalanceService.removeBalance).toHaveBeenCalledWith('123', 'bitcoin');
  });

  it('should update a balance', async (): Promise<void> => {
    const result = await controller.updateBalance({ asset: 'bitcoin', amount: 2 }, '123');
    expect(result).toEqual({ userId: '123' });
    expect(mockBalanceService.updateBalance).toHaveBeenCalledWith('123', 'bitcoin', 2);
  });
});
