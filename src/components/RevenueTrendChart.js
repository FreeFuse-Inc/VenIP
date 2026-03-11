import React from 'react';
import '../styles/Charts.css';

const RevenueTrendChart = () => {
  const data = [
    { month: 'Jan', revenue: 28000 },
    { month: 'Feb', revenue: 35000 },
    { month: 'Mar', revenue: 42000 },
    { month: 'Apr', revenue: 38000 },
    { month: 'May', revenue: 52000 },
    { month: 'Jun', revenue: 65000 },
    { month: 'Jul', revenue: 71000 },
    { month: 'Aug', revenue: 78000 },
    { month: 'Sep', revenue: 85000 },
    { month: 'Oct', revenue: 92000 },
    { month: 'Nov', revenue: 98000 },
    { month: 'Dec', revenue: 107000 },
  ];

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const width = 500;
  const height = 300;
  const padding = 50;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * plotWidth,
    y: height - padding - (d.revenue / maxRevenue) * plotHeight,
    value: d.revenue,
    month: d.month,
  }));

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaData = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="chart-container revenue-trend-chart">
      <h3 className="chart-title">Revenue Trend</h3>
      <p className="chart-subtitle">Last 12 Months</p>
      <svg width="100%" height="300" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#d1d5db" strokeWidth="1" />
        
        {/* X-axis */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#d1d5db" strokeWidth="1" />

        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = height - padding - (i / 4) * plotHeight;
          return (
            <line key={`grid-${i}`} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
          );
        })}

        {/* X-axis labels */}
        {points.map((p, i) => (
          <text key={`x-label-${i}`} x={p.x} y={height - padding + 20} textAnchor="middle" fontSize="11" fill="#6b7280">
            {data[i].month}
          </text>
        ))}

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = height - padding - (i / 4) * plotHeight;
          const value = Math.round((i / 4) * maxRevenue);
          return (
            <text key={`y-label-${i}`} x={padding - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#6b7280">
              ${(value / 1000).toFixed(0)}K
            </text>
          );
        })}

        {/* Area under the curve */}
        <path d={areaData} fill="url(#revenueGradient)" />

        {/* Revenue line */}
        <path d={pathData} stroke="#10b981" strokeWidth="2.5" fill="none" />

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={`point-${i}`} cx={p.x} cy={p.y} r="3" fill="#10b981" />
        ))}
      </svg>
    </div>
  );
};

export default RevenueTrendChart;
