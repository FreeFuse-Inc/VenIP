import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import '../styles/Charts.css';

const EngagementChart = () => {
  const data = [
    { day: 'Mon', engagement: 1200 },
    { day: 'Tue', engagement: 1800 },
    { day: 'Wed', engagement: 2400 },
    { day: 'Thu', engagement: 2800 },
    { day: 'Fri', engagement: 3200 },
    { day: 'Sat', engagement: 4100 },
    { day: 'Sun', engagement: 4800 },
  ];

  return (
    <div className="chart-container engagement-chart">
      <h3 className="chart-title">Engagement</h3>
      <p className="chart-subtitle">Last 7 Days</p>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F7DFF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4F7DFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
          <Area
            type="monotone"
            dataKey="engagement"
            stroke="#4F7DFF"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorEngagement)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementChart;
