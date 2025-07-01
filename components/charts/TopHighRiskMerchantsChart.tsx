
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ProcessedTransaction, RiskLevel } from '../../types';
import { TOP_N_HIGH_RISK_MERCHANTS } from '../../constants';

interface TopHighRiskMerchantsChartProps {
  transactions: ProcessedTransaction[];
}

// Consistent colors with RiskByLocationChart or define new ones
const MERCHANT_CHART_COLORS = ['#0ea5e9', '#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc']; // Example: shades of cyan/sky

export const TopHighRiskMerchantsChart: React.FC<TopHighRiskMerchantsChartProps> = ({ transactions }) => {
  const highRiskTransactions = transactions.filter(
    t => t.riskTag === RiskLevel.High || t.riskTag === RiskLevel.LikelyFraud
  );

  const countsByMerchant: { [key: string]: number } = {};
  highRiskTransactions.forEach(t => {
    const merchantName = t.merchant || 'Unknown Merchant';
    countsByMerchant[merchantName] = (countsByMerchant[merchantName] || 0) + 1;
  });

  const chartData = Object.entries(countsByMerchant)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_N_HIGH_RISK_MERCHANTS);

  if (chartData.length === 0) {
    return <p className="text-slate-400 text-sm h-full flex items-center justify-center">No high-risk merchants to display.</p>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <YAxis 
            dataKey="name" 
            type="category" 
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
            width={80} // Adjust width for merchant names
            interval={0}
            style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
            itemStyle={{ color: '#cbd5e1' }}
            formatter={(value: number) => [value, 'Count']}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '10px' }} />
          <Bar dataKey="count" name="High-Risk Txns">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={MERCHANT_CHART_COLORS[index % MERCHANT_CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
