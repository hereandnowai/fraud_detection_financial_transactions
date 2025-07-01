
import React from 'react';
import { ProcessedTransaction } from '../../types';
import { RiskTag } from '../RiskTag';
import { TOP_N_RISKY_TRANSACTIONS } from '../../constants';

interface TopRiskyTransactionsListProps {
  transactions: ProcessedTransaction[];
}

export const TopRiskyTransactionsList: React.FC<TopRiskyTransactionsListProps> = ({ transactions }) => {
  const sortedTransactions = [...transactions]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, TOP_N_RISKY_TRANSACTIONS);

  if (sortedTransactions.length === 0) return <p className="text-slate-400 text-sm">No risky transactions to display.</p>;
  
  return (
    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
      {sortedTransactions.map(t => (
        <div key={t.transaction_id} className="p-3 bg-slate-800 rounded-md shadow ring-1 ring-slate-700/50">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-slate-300 truncate" title={t.transaction_id}>ID: {t.transaction_id}</span>
            <RiskTag level={t.riskTag} />
          </div>
          <div className="text-xs text-slate-400">
            Amount: <span className="font-semibold text-slate-300">{t.originalAmount}</span> | Score: <span className="font-semibold text-slate-300">{t.riskScore.toFixed(3)}</span>
          </div>
          <div className="text-xs text-slate-500">
            Customer: {t.customer_id} | Location: {t.location}
          </div>
        </div>
      ))}
    </div>
  );
};
