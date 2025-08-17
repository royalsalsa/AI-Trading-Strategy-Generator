export interface AnalysisResult {
  ticker: string;
  currentPrice: number;
  pivotPoints: {
    s3: number;
    s2: number;
    s1: number;
    pp: number;
    r1: number;
    r2: number;
    r3: number;
  };
  rsi: {
    value: number;
    interpretation: 'Overbought' | 'Oversold' | 'Neutral';
  };
  movingAverages: {
    ma50: number;
    ma200: number;
  };
  strategy: {
    signal: 'BUY' | 'SELL' | 'HOLD';
    description: string;
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
  };
}

export interface ChartDataPoint {
  name: string;
  price: number;
}

export interface Source {
  web?: {
    uri: string;
    title?: string;
  };
}