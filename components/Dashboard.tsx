
import React from 'react';
import { ProcessedTransaction } from '../types';
import { RiskDistributionChart } from './charts/RiskDistributionChart';
import { TopRiskyTransactionsList } from './charts/TopRiskyTransactionsList';
import { RiskByLocationChart } from './charts/RiskByLocationChart';
import { TotalSummary } from './charts/TotalSummary';
import { TopHighRiskMerchantsChart } from './charts/TopHighRiskMerchantsChart';
import { RiskOverTimeChart } from './charts/RiskOverTimeChart';

interface DashboardProps {
  transactions: ProcessedTransaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return <TotalSummary transactions={transactions} />;
  }

  return (
    <>
      <TotalSummary transactions={transactions} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-slate-850 p-4 rounded-lg shadow-md ring-1 ring-slate-700 h-80">
          <h3 className="text-lg font-semibold mb-3 text-[var(--brand-primary)]">Risk Distribution</h3>
          <RiskDistributionChart transactions={transactions} />
        </div>
        <div className="bg-slate-850 p-4 rounded-lg shadow-md ring-1 ring-slate-700 h-80">
          <h3 className="text-lg font-semibold mb-3 text-[var(--brand-primary)]">Risk by Location (Top High Risk)</h3>
          <RiskByLocationChart transactions={transactions} />
        </div>
        <div className="bg-slate-850 p-4 rounded-lg shadow-md ring-1 ring-slate-700 h-80">
          <h3 className="text-lg font-semibold mb-3 text-[var(--brand-primary)]">Top High-Risk Merchants</h3>
          <TopHighRiskMerchantsChart transactions={transactions} />
        </div>

        <div className="bg-slate-850 p-4 rounded-lg shadow-md ring-1 ring-slate-700 md:col-span-2 lg:col-span-2 h-96">
          <h3 className="text-lg font-semibold mb-3 text-[var(--brand-primary)]">Risk Over Time</h3>
          <RiskOverTimeChart transactions={transactions} />
        </div>
        <div className="bg-slate-850 p-4 rounded-lg shadow-md ring-1 ring-slate-700 h-96">
          <h3 className="text-lg font-semibold mb-3 text-[var(--brand-primary)]">Top Risky Transactions</h3>
          <TopRiskyTransactionsList transactions={transactions} />
        </div>
      </div>
    </>
  );
};
