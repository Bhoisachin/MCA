
import React from 'react';
import { ErrorIcon } from './icons/ErrorIcon';

interface ErrorDisplayProps {
  message: string;
  onReset: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-red-50 border border-red-200 rounded-xl shadow-lg max-w-xl mx-auto">
        <ErrorIcon />
        <h3 className="mt-4 text-xl font-bold text-red-800">An Error Occurred</h3>
        <p className="mt-2 text-red-700">{message}</p>
        <button
          onClick={onReset}
          className="mt-6 bg-red-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
    </div>
  );
};
