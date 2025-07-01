
import { Transaction, ProcessedTransaction, RiskLevel } from '../types';
import { SCORE_THRESHOLD_LOW, SCORE_THRESHOLD_MODERATE, SCORE_THRESHOLD_HIGH } from '../constants';

const assignRiskTag = (score: number): RiskLevel => {
  if (score >= SCORE_THRESHOLD_HIGH) return RiskLevel.LikelyFraud;
  if (score >= SCORE_THRESHOLD_MODERATE) return RiskLevel.High;
  if (score >= SCORE_THRESHOLD_LOW) return RiskLevel.Moderate;
  return RiskLevel.Low;
};

export const processTransactions = (transactions: Transaction[]): ProcessedTransaction[] => {
  // Simulate AI/ML processing
  return transactions.map(transaction => {
    // Basic pseudo-random score generation for demonstration
    // A real model would use features from the transaction
    let score = Math.random();

    // Example of simple rule-based adjustment (very naive)
    if (transaction.amount > 10000) { // transaction.amount is number here
      score = Math.min(1, score + 0.1); // Increase score slightly for high amounts
    }
    // transaction.location and transaction.device_id are typed as string in Transaction interface
    if (transaction.location.toLowerCase() === 'unknown' || transaction.device_id.toLowerCase() === 'emulator') {
      score = Math.min(1, score + 0.2); // Increase score for suspicious indicators
    }
    
    // Ensure score is within [0,1]
    score = Math.max(0, Math.min(1, score));

    // Spread all properties from Transaction, then add/override specific ones for ProcessedTransaction
    const processedTx: ProcessedTransaction = {
      ...transaction, // transaction is of Type Transaction, includes amount: number, originalAmount: string, and [key: string]: string | number
      riskScore: score, // number
      riskTag: assignRiskTag(score), // RiskLevel (string enum)
    };
    return processedTx;
  });
};
