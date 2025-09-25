
import React from 'react';

interface ThemeCloudProps {
  themes: { theme: string; count: number }[];
}

const themeColors = [
    'bg-blue-100 text-blue-800',
    'bg-indigo-100 text-indigo-800',
    'bg-purple-100 text-purple-800',
    'bg-sky-100 text-sky-800',
    'bg-teal-100 text-teal-800',
];


export const ThemeCloud: React.FC<ThemeCloudProps> = ({ themes }) => {
  if (!themes || themes.length === 0) {
    return <p className="text-slate-500">No themes were extracted.</p>;
  }
  
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {themes.map(({theme, count}, index) => (
        <div key={index} className={`flex items-center rounded-lg px-3 py-1.5 ${themeColors[index % themeColors.length]}`}>
            <span className="font-bold text-sm capitalize">{theme}</span>
            <span className="ml-2 text-xs font-semibold bg-white/60 rounded-full px-2 py-0.5">{count}</span>
        </div>
      ))}
    </div>
  );
};
