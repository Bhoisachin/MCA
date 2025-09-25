
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-xl shadow-lg border border-slate-200 max-w-md mx-auto">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <h3 className="mt-6 text-lg font-semibold text-slate-700">Analyzing Feedback...</h3>
        <p className="mt-2 text-sm text-slate-500">
            This may take a moment. The AI is processing sentiment, summaries, and themes.
        </p>
    </div>
  );
};
