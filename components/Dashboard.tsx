import React, { useMemo } from 'react';
import type { AnalysisResult } from '../types';
import { Sentiment } from '../types';
import { SentimentChart } from './SentimentChart';
import { ResultsTable } from './ResultsTable';
import { ThemeCloud } from './ThemeCloud';
import { DownloadIcon } from './icons/DownloadIcon';
import { StartOverIcon } from './icons/StartOverIcon';

interface DashboardProps {
  result: AnalysisResult;
  fileName: string;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ result, fileName, onReset }) => {
  const sentimentCounts = useMemo(() => {
    const counts = {
      [Sentiment.Positive]: 0,
      [Sentiment.Negative]: 0,
      [Sentiment.Neutral]: 0,
    };
    result.comments.forEach(comment => {
      counts[comment.sentiment]++;
    });
    return [
      { name: 'Positive', value: counts[Sentiment.Positive] },
      { name: 'Negative', value: counts[Sentiment.Negative] },
      { name: 'Neutral', value: counts[Sentiment.Neutral] },
    ];
  }, [result.comments]);
  
  const handleDownloadCSV = () => {
    if (!result) return;
    const headers = ['Original_Comment', 'Stakeholder_Type', 'Sentiment', 'Summary', 'Themes'];
    
    const rows = result.comments.map(c => {
        const escapedComment = `"${c.originalComment.replace(/"/g, '""')}"`;
        const stakeholderType = c.stakeholderType || 'N/A';
        const sentiment = c.sentiment;
        const escapedSummary = `"${c.summary.replace(/"/g, '""')}"`;
        const themes = `"${c.themes.join('; ')}"`; // Use semicolon to avoid conflicts with commas
        return [escapedComment, stakeholderType, sentiment, escapedSummary, themes].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${fileName.replace(/\.csv$/, '')}_analysis.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Analysis Dashboard</h1>
          <p className="text-slate-500 mt-1">Results for: <span className="font-medium text-slate-600">{fileName}</span></p>
        </div>
        <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadCSV}
              className="bg-white text-slate-700 font-semibold py-2 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm flex items-center"
            >
              <DownloadIcon />
              Download CSV
            </button>
            <button
              onClick={onReset}
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center"
            >
              <StartOverIcon />
              Start Over
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h2 className="text-xl font-bold text-slate-700 mb-4">Sentiment Breakdown</h2>
          <SentimentChart data={sentimentCounts} />
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h2 className="text-xl font-bold text-slate-700 mb-4">Key Themes</h2>
          <ThemeCloud themes={result.overallThemes} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-xl font-bold text-slate-700 mb-4">Detailed Feedback Analysis</h2>
        <ResultsTable data={result.comments} />
      </div>
    </div>
  );
};