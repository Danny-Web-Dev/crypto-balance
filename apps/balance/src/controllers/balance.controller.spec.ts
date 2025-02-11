import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import { BalanceService } from '../services/balance.service';

describe('BalanceServiceController', () => {
  let balanceServiceController: BalanceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [BalanceService],
    }).compile();

    balanceServiceController = app.get<BalanceController>(BalanceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(balanceServiceController.getHello()).toBe('Hello World!');
    });
  });
});
