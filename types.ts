
export interface CandleDataPoint {
  time: string; // ISO 8601 string (e.g., "YYYY-MM-DDTHH:mm:ssZ")
  open: number;
  high: number;
  low: number;
  close: number;
}

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
    takeProfit1: number;
    takeProfit2: number;
    confidence: number; // A score from 0 to 100
    analysisDescription: string;
    riskTip: string;
  };
  marketSentiment: 'Bullish' | 'Bearish' | 'Neutral';
  newsSummary: string;
  historicalData: CandleDataPoint[];
}

export interface Source {
  web?: {
    uri: string;
    title?: string;
  };
}

export interface HistoryItem {
  id: string;
  ticker: string;
  timestamp: string; // ISO string
  currentPrice: number;
  analysisDescription: string;
  riskTip: string;
  sources?: Source[];
  marketSentiment: 'Bullish' | 'Bearish' | 'Neutral';
  newsSummary: string;
}

export interface NewsArticle {
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  publishedDate: string; // ISO 8601 string
}