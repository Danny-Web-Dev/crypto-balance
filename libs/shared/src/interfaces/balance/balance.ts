export interface Balance {
  [asset: string]: {
    amount: number;
    currencies?: {
      usd: number,
      eur: number,
      gbp: number,
    }
  };
}
