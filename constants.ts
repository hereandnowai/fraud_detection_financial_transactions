
import { RiskLevel } from './types';

export const REQUIRED_COLUMNS: string[] = [
  'transaction_id',
  'timestamp',
  'amount',
  'merchant',
  'customer_id',
  'location',
  'device_id',
  'transaction_type',
];

export const SCORE_THRESHOLD_LOW = 0.3;
export const SCORE_THRESHOLD_MODERATE = 0.7;
export const SCORE_THRESHOLD_HIGH = 0.9;

export const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  [RiskLevel.Low]: 'bg-green-100 text-green-700 border-green-300',
  [RiskLevel.Moderate]: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  [RiskLevel.High]: 'bg-orange-100 text-orange-700 border-orange-300',
  [RiskLevel.LikelyFraud]: 'bg-red-100 text-red-700 border-red-300',
};

export const MAX_TRANSACTIONS_TO_DISPLAY_IN_CHART = 10; // Used by RiskByLocationChart
export const TOP_N_RISKY_TRANSACTIONS = 5;
export const TOP_N_HIGH_RISK_MERCHANTS = 5;

export const DEFAULT_CURRENCY_SYMBOL = '$';
