
import React from 'react';
import type { CommentAnalysis } from '../types';
import { Sentiment } from '../types';

interface ResultsTableProps {
  data: CommentAnalysis[];
}

const SentimentBadge: React.FC<{ sentiment: Sentiment }> = ({ sentiment }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block";
  const sentimentClasses = {
    [Sentiment.Positive]: "bg-green-100 text-green-800",
    [Sentiment.Negative]: "bg-red-100 text-red-800",
    [Sentiment.Neutral]: "bg-slate-100 text-slate-800",
  };
  return <span className={`${baseClasses} ${sentimentClasses[sentiment]}`}>{sentiment}</span>;
};

export const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  const hasStakeholderType = data.some(item => !!item.stakeholderType);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
              Sentiment
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
              Summary
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
              Key Themes
            </th>
            {hasStakeholderType && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Stakeholder Type
                </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {data.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap align-top">
                <SentimentBadge sentiment={item.sentiment} />
              </td>
              <td className="px-6 py-4 align-top">
                <p className="text-sm text-slate-900">{item.summary}</p>
                <p className="text-sm text-slate-500 mt-2 italic">"{item.originalComment}"</p>
              </td>
              <td className="px-6 py-4 align-top">
                <div className="flex flex-wrap gap-2 max-w-xs">
                    {item.themes.map((theme, index) => (
                        <span key={index} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">
                            {theme}
                        </span>
                    ))}
                </div>
              </td>
              {hasStakeholderType && (
                <td className="px-6 py-4 whitespace-nowrap align-top">
                    <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md">
                        {item.stakeholderType || 'N/A'}
                    </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
