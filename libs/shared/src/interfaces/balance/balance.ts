import { Currencies } from '@app/shared/interfaces/balance/currencies';

export interface Balance {
  [asset: string]: {
    amount: number;
    currencies?: Currencies;
  };
}
