
import React from 'react';
import { RiskLevel } from '../types';
import { RISK_LEVEL_COLORS } from '../constants';

interface RiskTagProps {
  level: RiskLevel;
}

export const RiskTag: React.FC<RiskTagProps> = ({ level }) => {
  const colorClasses = RISK_LEVEL_COLORS[level] || 'bg-gray-100 text-gray-700 border-gray-300';
  
  return (
    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${colorClasses}`}>
      {level}
    </span>
  );
};
