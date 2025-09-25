import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SentimentChartProps {
  data: { name: string; value: number }[];
}

const COLORS = {
  Positive: '#22c55e', // green-500
  Negative: '#ef4444', // red-500
  Neutral: '#64748b', // slate-500
};

// Custom label renderer for the pie chart slices to display percentages
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  // Don't render label for segments with 0 value
  if (percent === 0) {
    return null;
  }
  
  // Calculate position for the label inside the slice
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6; 
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="font-bold text-sm select-none"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  // Filter out sentiments with 0 comments so they don't appear in the chart/legend
  const chartData = data.filter(d => d.value > 0);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100} // Increased radius for better visibility
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} comments`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
