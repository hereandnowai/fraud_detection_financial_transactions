
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ProcessedTransaction, RiskLevel } from '../../types';
import { RISK_LEVEL_COLORS } from '../../constants';

interface RiskDistributionChartProps {
  transactions: ProcessedTransaction[];
}

const RISK_COLOR_MAP: Record<RiskLevel, string> = {
  [RiskLevel.Low]: '#22c55e', // green-500
  [RiskLevel.Moderate]: '#f59e0b', // yellow-500
  [RiskLevel.High]: '#f97316', // orange-500
  [RiskLevel.LikelyFraud]: '#ef4444', // red-500
};


export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ transactions }) => {
  const data = Object.values(RiskLevel).map(level => {
    const count = transactions.filter(t => t.riskTag === level).length;
    return { name: level.split(' ')[1] || "Risk", count, fill: RISK_COLOR_MAP[level] }; // Use second word for brevity
  });

  if (transactions.length === 0) return <p className="text-slate-400 text-sm">No data for chart.</p>;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
            itemStyle={{ color: '#cbd5e1' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
          <Bar dataKey="count" name="Transactions">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
