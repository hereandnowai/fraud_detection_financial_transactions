
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ProcessedTransaction, RiskLevel } from '../../types';
import { MAX_TRANSACTIONS_TO_DISPLAY_IN_CHART } from '../../constants';

interface RiskByLocationChartProps {
  transactions: ProcessedTransaction[];
}

const LOCATION_COLORS = ['#38bdf8', '#67e8f9', '#a5f3fc', '#cffafe', '#e0f2fe']; // sky-400 to sky-100

export const RiskByLocationChart: React.FC<RiskByLocationChartProps> = ({ transactions }) => {
  const highRiskTransactions = transactions.filter(
    t => t.riskTag === RiskLevel.High || t.riskTag === RiskLevel.LikelyFraud
  );

  const countsByLocation: { [key: string]: number } = {};
  highRiskTransactions.forEach(t => {
    countsByLocation[t.location] = (countsByLocation[t.location] || 0) + 1;
  });

  const chartData = Object.entries(countsByLocation)
    .map(([location, count]) => ({ name: location, count }))
    .sort((a, b) => b.count - a.count) // Sort by count descending
    .slice(0, MAX_TRANSACTIONS_TO_DISPLAY_IN_CHART); // Take top N

  if (chartData.length === 0) return <p className="text-slate-400 text-sm">No high-risk transactions by location to display.</p>;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <YAxis 
            dataKey="name" 
            type="category" 
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
            width={70} 
            interval={0}
            style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
            itemStyle={{ color: '#cbd5e1' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
          <Bar dataKey="count" name="High Risk Count">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={LOCATION_COLORS[index % LOCATION_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
