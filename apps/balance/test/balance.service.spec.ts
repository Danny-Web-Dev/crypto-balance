import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from '../src/balance.service';
import { BalanceDataService } from '@app/shared/data/balance-data/balance-data.service';
import { LoggingService } from '@app/shared/log/log.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ServerError } from '@app/shared/errors/server-error';
import ErrorType from '@app/shared/errors/error-type';
import { jest } from '@jest/globals';
import { UserBalances } from '@app/shared/interfaces/balance/user-balance';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('BalanceService', (): void => {
  let balanceService: BalanceService;
  let balanceDataService: jest.Mocked<BalanceDataService>;
  let loggingService: jest.Mocked<LoggingService>;
  let httpService: jest.Mocked<HttpService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        {
          provide: BalanceDataService,
          useValue: {
            readData: jest.fn(),
            writeData: jest.fn(),
          },
        },
        {
          provide: LoggingService,
          useValue: { log: jest.fn(), error: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('http://mock-rates-host') },
        },
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    balanceService = module.get<BalanceService>(BalanceService);
    balanceDataService = module.get(BalanceDataService);
    loggingService = module.get(LoggingService);
    configService = module.get(ConfigService);
    httpService = module.get(HttpService);
  });

  // Get Balance
  it('should return balances for a user', async (): Promise<void> => {
    const userId = '1';
    const mockData: UserBalances = {
      '1': { bitcoin: { amount: 2, currencies: { usd: 50000, eur: 46000, gbp: 39000 } } },
    };
    balanceDataService.readData.mockResolvedValue(mockData);

    const result = await balanceService.getBalances(userId);

    expect(result).toEqual(mockData[userId]);
    expect(jest.spyOn(balanceDataService, 'readData')).toHaveBeenCalled();
  });

  // Add balance
  it('should add balance for a user and fetch exchange rates', async (): Promise<void> => {
    const userId = '1';
    const asset = 'bitcoin';
    const amount = 2;
    const mockData: UserBalances = { '1': {} };
    const mockRates = { usd: 50000, eur: 46000, gbp: 39000 };

    balanceDataService.readData.mockResolvedValue(mockData);
    balanceDataService.writeData.mockResolvedValue(undefined);
    jest.spyOn(balanceService as any, 'getCoinRates').mockResolvedValue(mockRates);

    const result = await balanceService.addBalance(userId, asset, amount);

    expect(result.bitcoin.amount).toBe(2);
    expect(result.bitcoin.currencies).toEqual(mockRates);
    expect(jest.spyOn(balanceDataService, 'writeData')).toHaveBeenCalled();
    expect(jest.spyOn(loggingService, 'log')).toHaveBeenCalledWith(
      `Added balance for userId: ${userId}, asset: ${asset}, amount: ${amount}`,
    );
  });

  // Remove Balance
  it('should remove balance for a user', async (): Promise<void> => {
    const userId = '1';
    const asset = 'bitcoin';
    const mockData: UserBalances = {
      '1': {
        bitcoin: {
          amount: 2,
          currencies: { usd: 50000, eur: 45000, gbp: 40000 },
        },
      },
    };

    balanceDataService.readData.mockResolvedValue(mockData);
    balanceDataService.writeData.mockResolvedValue(undefined);

    const result = await balanceService.removeBalance(userId, asset);

    expect(result.userId).toBe(userId);
    expect(jest.spyOn(balanceDataService, 'writeData')).toHaveBeenCalled();
  });

  it('should throw error when removing balance for a non-existent user', async (): Promise<void> => {
    const userId = '1';
    const asset = 'bitcoin';

    balanceDataService.readData.mockResolvedValue({});

    await expect(balanceService.removeBalance(userId, asset)).rejects.toThrow(
      new ServerError(ErrorType.USER_DOES_NOT_EXIST.message, ErrorType.USER_DOES_NOT_EXIST.errorCode),
    );
  });

  // Update balance
  it('should update balance for a user', async (): Promise<void> => {
    const userId = '1';
    const asset = 'bitcoin';
    const amount = 5;
    const mockData: UserBalances = {
      '1': {
        bitcoin: {
          amount: 2,
          currencies: { usd: 50000, eur: 45000, gbp: 40000 },
        },
      },
    };

    balanceDataService.readData.mockResolvedValue(mockData);
    balanceDataService.writeData.mockResolvedValue(undefined);

    const result = await balanceService.updateBalance(userId, asset, amount);

    expect(result.userId).toBe(userId);
    expect(jest.spyOn(balanceDataService, 'writeData')).toHaveBeenCalled();
    expect(jest.spyOn(loggingService, 'log')).toHaveBeenCalledWith(
      `Updated balance for userId: ${userId}, asset: ${asset} from 2 to ${amount}`,
    );
  });

  it('should throw error when updating non-existent asset', async (): Promise<void> => {
    const userId = '1';
    const asset = 'bitcoin';
    const amount = 5;
    balanceDataService.readData.mockResolvedValue({ '1': {} });

    await expect(balanceService.updateBalance(userId, asset, amount)).rejects.toThrow(
      new ServerError(ErrorType.ASSET_NOT_FOUND.message, ErrorType.ASSET_NOT_FOUND.errorCode),
    );
  });

  // Fetch coin rates
  it('should fetch coin rates', async (): Promise<void> => {
    const asset = 'bitcoin';
    const mockRates = { usd: 50000, eur: 46000, gbp: 39000 };
    httpService.get.mockReturnValueOnce(of({ data: { data: { bitcoin: mockRates } } } as AxiosResponse<any>));

    const result = await balanceService['getCoinRates'](asset);

    expect(result).toEqual(mockRates);
    expect(jest.spyOn(configService, 'get')).toHaveBeenCalledWith('RATES_HOST');
    expect(jest.spyOn(httpService, 'get')).toHaveBeenCalled();
  });

  it('should handle error when fetching coin rates', async (): Promise<void> => {
    const asset = 'bitcoin';
    httpService.get.mockReturnValueOnce(of({ data: null } as AxiosResponse<any>));

    await expect(balanceService['getCoinRates'](asset)).rejects.toThrow(ServerError);
  });

  // Balance data
  it('should clean empty balance users', (): void => {
    const data: UserBalances = { '1': {} };
    balanceService['cleanEmptyBalanceUser'](data, '1');

    expect(data).toEqual({});
  });

  // data validations
  it('should validate data successfully', (): void => {
    const data: UserBalances = {
      '1': {
        bitcoin: {
          amount: 2,
          currencies: { usd: 50000, eur: 45000, gbp: 40000 },
        },
      },
    };

    expect(() => balanceService['validateData'](data, '1', 'bitcoin')).not.toThrow();
  });

  it('should throw error when validating non-existent user', (): void => {
    const data: UserBalances = {};

    expect(() => balanceService['validateData'](data, '1', 'bitcoin')).toThrow(
      new ServerError(ErrorType.USER_DOES_NOT_EXIST.message, ErrorType.USER_DOES_NOT_EXIST.errorCode),
    );
  });
});
