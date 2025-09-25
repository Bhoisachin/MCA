
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "text/csv") {
        onFileUpload(file);
    } else {
        alert("Please drop a valid CSV file.");
    }
  }, [onFileUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const borderStyle = isDragOver 
    ? 'border-blue-500 bg-blue-50' 
    : 'border-slate-300 hover:border-blue-400';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-700 text-center mb-2">Upload Stakeholder Feedback</h2>
        <p className="text-center text-slate-500 mb-6">Drag & drop or click to upload a CSV file with comments.</p>
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex justify-center w-full h-48 px-4 transition ${borderStyle} border-2 border-dashed rounded-md appearance-none cursor-pointer`}
        >
          <span className="flex flex-col items-center justify-center space-y-2">
            <UploadIcon />
            <span className="font-medium text-slate-600">
              Drop files to Attach, or <span className="text-blue-600 underline">browse</span>
            </span>
             <span className="text-xs text-slate-500">Only .csv files are supported</span>
          </span>
          <input type="file" name="file_upload" className="hidden" accept=".csv" onChange={handleFileChange} />
        </label>
      </div>
    </div>
  );
};
