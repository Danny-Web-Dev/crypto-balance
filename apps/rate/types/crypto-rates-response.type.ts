export interface CryptoRatesResponse {
  [key: string]: {
    usd: number;
    eur?: number;
    gbp?: number;
    [key: string]: number | undefined;
  };
}
