
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProcessedTransaction, RiskLevel } from '../../types';

interface RiskOverTimeChartProps {
  transactions: ProcessedTransaction[];
}

interface TimeDataPoint {
  date: string;
  total: number;
  highRisk: number;
}

export const RiskOverTimeChart: React.FC<RiskOverTimeChartProps> = ({ transactions }) => {
  const aggregatedData: { [key: string]: { total: number; highRisk: number } } = {};

  transactions.forEach(t => {
    try {
      const dateObj = new Date(t.timestamp);
      if (isNaN(dateObj.getTime())) {
        console.warn(`Invalid timestamp format for transaction ID ${t.transaction_id}: ${t.timestamp}`);
        return; // Skip this transaction
      }
      // Format date as YYYY-MM-DD for grouping. Adjust if timestamps are only dates.
      const dateKey = dateObj.toISOString().split('T')[0]; 

      if (!aggregatedData[dateKey]) {
        aggregatedData[dateKey] = { total: 0, highRisk: 0 };
      }
      aggregatedData[dateKey].total += 1;
      if (t.riskTag === RiskLevel.High || t.riskTag === RiskLevel.LikelyFraud) {
        aggregatedData[dateKey].highRisk += 1;
      }
    } catch (e) {
      console.warn(`Error parsing timestamp for transaction ID ${t.transaction_id}: ${t.timestamp}`, e);
    }
  });

  const chartData: TimeDataPoint[] = Object.entries(aggregatedData)
    .map(([date, counts]) => ({ date, ...counts }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date

  if (chartData.length === 0) {
    return <p className="text-slate-400 text-sm h-full flex items-center justify-center">Not enough data for time series analysis.</p>;
  }
  
  // If only one data point, recharts line chart might not render well. Consider a message or different display.
  // For now, let it try to render.

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
            // tickFormatter={(tick) => new Date(tick).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
            minTickGap={20} // Adjust to avoid label overlap
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
            itemStyle={{ color: '#cbd5e1' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
          <Line type="monotone" dataKey="total" name="Total Transactions" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="highRisk" name="High-Risk Transactions" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
