
import React from 'react';
import { AnalyticsIcon } from './icons/AnalyticsIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
            <AnalyticsIcon />
            <h1 className="text-xl font-bold text-slate-800">
            MCA Stakeholder Feedback Analysis
          </h1>
        </div>
      </div>
    </header>
  );
};
