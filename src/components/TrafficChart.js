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

const TrafficChart = () => {
  const data = [
    { day: 'Mon', traffic: 2400 },
    { day: 'Tue', traffic: 3200 },
    { day: 'Wed', traffic: 4800 },
    { day: 'Thu', traffic: 5100 },
    { day: 'Fri', traffic: 6200 },
    { day: 'Sat', traffic: 7800 },
    { day: 'Sun', traffic: 8500 },
  ];

  return (
    <div className="chart-container traffic-chart">
      <h3 className="chart-title">Site Traffic</h3>
      <p className="chart-subtitle">Last 7 Days</p>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
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
            dataKey="traffic"
            stroke="#4F7DFF"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorTraffic)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrafficChart;
