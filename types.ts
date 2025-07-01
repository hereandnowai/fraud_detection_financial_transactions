
export interface RawTransaction {
  transaction_id: string;
  timestamp: string;
  amount: string; // Raw amount from CSV, may include currency symbols
  merchant: string;
  customer_id: string;
  location: string;
  device_id: string;
  transaction_type: string;
  [key: string]: string; // To accommodate any extra columns, all initially strings
}

export interface Transaction {
  transaction_id: string;
  timestamp: string;
  amount: number; // Parsed numeric amount
  originalAmount: string; // Store original amount string for display
  merchant: string;
  customer_id: string;
  location: string;
  device_id: string;
  transaction_type: string;
  // Index signature to allow specific numeric/string properties and passthrough of other string properties
  [key: string]: string | number; 
}

export enum RiskLevel {
  Low = '✅ Low Risk',
  Moderate = '⚠️ Moderate Risk',
  High = '🚨 High Risk',
  LikelyFraud = '❌ Likely Fraud',
}

export interface ProcessedTransaction extends Transaction {
  riskScore: number;
  riskTag: RiskLevel; // RiskLevel enum values are strings
  // Inherits [key: string]: string | number index signature from Transaction
  // riskScore (number) and riskTag (string enum) are compatible with this.
}
