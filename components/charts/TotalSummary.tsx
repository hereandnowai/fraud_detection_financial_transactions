
import React from 'react';
import { ProcessedTransaction, RiskLevel } from '../../types';
import { DEFAULT_CURRENCY_SYMBOL } from '../../constants';

// Existing Icons
const ArrowUpRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
  </svg>
);

const ShieldExclamationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
  </svg>
);

const BanknotesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>
);

// New Icons
const CalculatorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);


interface TotalSummaryProps {
  transactions: ProcessedTransaction[];
}

export const TotalSummary: React.FC<TotalSummaryProps> = ({ transactions }) => {
  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;
  const highestRiskScore = totalTransactions > 0 ? Math.max(...transactions.map(t => t.riskScore)) : 0;
  
  const highRiskCount = transactions.filter(t => t.riskTag === RiskLevel.High || t.riskTag === RiskLevel.LikelyFraud).length;
  // const likelyFraudCount = transactions.filter(t => t.riskTag === RiskLevel.LikelyFraud).length; // This was one of the original KPIs, can be re-added if needed. For now, matching user's list.

  const formatCurrency = (value: number) => {
    const firstTransactionAmount = transactions.length > 0 ? transactions[0].originalAmount : "0";
    // Attempt to get currency symbol, fallback to DEFAULT_CURRENCY_SYMBOL
    const currencySymbol = firstTransactionAmount.match(/[^\d.,\s]/)?.[0] || DEFAULT_CURRENCY_SYMBOL; 
    return `${currencySymbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const summaryItems = [
    { title: 'Total Transactions', value: totalTransactions.toLocaleString(), icon: <ArrowUpRightIcon className="w-6 h-6 text-blue-400" />, color: 'text-blue-400' },
    { title: 'Total Amount Processed', value: formatCurrency(totalAmount), icon: <BanknotesIcon className="w-6 h-6 text-green-400" />, color: 'text-green-400' },
    { title: 'Avg. Transaction Amount', value: formatCurrency(averageAmount), icon: <CalculatorIcon className="w-6 h-6 text-indigo-400" />, color: 'text-indigo-400' },
    { title: 'Total Suspicious Txns', value: highRiskCount.toLocaleString(), icon: <ShieldExclamationIcon className="w-6 h-6 text-red-400" />, color: 'text-red-400' },
    { title: 'Highest Risk Score', value: highestRiskScore.toFixed(3), icon: <TrendingUpIcon className="w-6 h-6 text-orange-400" />, color: 'text-orange-400' },
  ];

  if (totalTransactions === 0) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {summaryItems.map(item => (
                 <div key={item.title} className="bg-slate-850 p-4 rounded-lg shadow-md ring-1 ring-slate-700 flex items-center space-x-3 opacity-50">
                    <div className={`p-2 rounded-full bg-slate-700`}>
                        {item.icon}
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">{item.title}</p>
                        <p className={`text-xl font-semibold ${item.color}`}>{item.title.includes("Amount") || item.title.includes("Score") ? "N/A" : "0"}</p>
                    </div>
                </div>
            ))}
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {summaryItems.map(item => (
        <div key={item.title} className="bg-slate-850 p-4 rounded-lg shadow-md ring-1 ring-slate-700 flex items-center space-x-3">
          <div className={`p-2 rounded-full bg-slate-700`}>
            {item.icon}
          </div>
          <div>
            <p className="text-xs text-slate-400">{item.title}</p>
            <p className={`text-xl font-semibold ${item.color}`}>{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
