
import React from 'react';
import { ProcessedTransaction } from '../types';
import { RiskTag } from './RiskTag';

interface TransactionTableProps {
  transactions: ProcessedTransaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return <p className="text-center text-slate-400">No transaction data to display.</p>;
  }

  const displayedKeys: (keyof ProcessedTransaction)[] = [
    'transaction_id', 
    'originalAmount', 
    'customer_id', 
    'location', 
    'riskScore', 
    'riskTag'
  ];
  
  const columnHeaders: { [key in keyof ProcessedTransaction]?: string } = {
    transaction_id: 'Transaction ID',
    originalAmount: 'Amount',
    customer_id: 'Customer ID',
    location: 'Location',
    riskScore: 'Risk Score',
    riskTag: 'Risk Tag',
    timestamp: 'Timestamp',
    merchant: 'Merchant',
    device_id: 'Device ID',
    transaction_type: 'Type'
  };


  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="min-w-full divide-y divide-slate-700 bg-slate-800">
        <thead className="bg-slate-750">
          <tr>
            {displayedKeys.map(key => (
              <th 
                key={key} 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-primary)] uppercase tracking-wider"
              >
                {columnHeaders[key] || key.toString().replace('_', ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {transactions.map((transaction) => (
            <tr key={transaction.transaction_id} className="hover:bg-slate-700/50 transition-colors duration-150">
              {displayedKeys.map(key => (
                <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                  {key === 'riskScore' ? 
                    (transaction[key] as number).toFixed(2) :
                  key === 'riskTag' ? 
                    <RiskTag level={transaction[key]} /> :
                  String(transaction[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
