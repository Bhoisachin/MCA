
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { analyzeFeedback, InputComment } from './services/geminiService';
import type { AnalysisResult } from './types';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const parseCSV = (csvText: string): InputComment[] => {
    // Remove UTF-8 BOM character if it exists at the beginning of the file.
    if (csvText.charCodeAt(0) === 0xFEFF) {
        csvText = csvText.substring(1);
    }
      
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return []; // Must have header and at least one row

    const header = lines[0].trim().split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    
    // Prioritize more specific keywords to avoid selecting the wrong column (e.g., 'comment_id').
    const commentKeywords = ['comment_text', 'feedback', 'remarks', 'review', 'comment', 'text'];
    let commentIndex = -1;
    for (const keyword of commentKeywords) {
      commentIndex = header.findIndex(h => h.includes(keyword));
      if (commentIndex !== -1) break;
    }
    
    if (commentIndex === -1) {
      throw new Error("Could not automatically detect the 'comment' column. Please ensure the CSV header contains keywords like 'comment', 'feedback', or 'text'.");
    }

    // Prioritize more specific stakeholder keywords.
    const stakeholderKeywords = ['stakeholder_type', 'stakeholder', 'group', 'category', 'type'];
    let stakeholderIndex = -1;
    for (const keyword of stakeholderKeywords) {
      stakeholderIndex = header.findIndex(h => h.includes(keyword));
      if (stakeholderIndex !== -1) break;
    }

    const dataRows = lines.slice(1);
    const parsedData: InputComment[] = [];

    dataRows.forEach((line, index) => {
      // This is a simple split and may not handle commas within quoted fields.
      const values = line.split(',');
      const commentText = values[commentIndex]?.trim().replace(/"/g, '');

      if (commentText && commentText.length > 10) {
        parsedData.push({
          id: index,
          comment: commentText,
          stakeholderType: stakeholderIndex !== -1 ? values[stakeholderIndex]?.trim().replace(/"/g, '') : undefined,
        });
      }
    });

    return parsedData;
  };

  const handleFileUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setAnalysisResult(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (!text) {
        setError('Could not read the file.');
        setIsProcessing(false);
        return;
      }

      try {
        const comments = parseCSV(text);
        if (comments.length === 0) {
          setError('No valid comments found. Please ensure a comment column was detected and contains text longer than 10 characters.');
          setIsProcessing(false);
          return;
        }

        const result = await analyzeFeedback(comments);
        setAnalysisResult(result);
      } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
        setError(`Failed to process feedback. ${errorMessage}`);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read the file.');
      setIsProcessing(false);
    };

    reader.readAsText(file);
  }, []);

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
    setIsProcessing(false);
    setFileName('');
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {!analysisResult && !isProcessing && !error && (
          <FileUpload onFileUpload={handleFileUpload} />
        )}
        {isProcessing && <Loader />}
        {error && <ErrorDisplay message={error} onReset={handleReset} />}
        {analysisResult && (
          <Dashboard result={analysisResult} fileName={fileName} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default App;
