import React from 'react';
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

  const maxValue = Math.max(...data.map(d => d.engagement));
  const width = 400;
  const height = 250;
  const padding = 40;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * plotWidth,
    y: height - padding - (d.engagement / maxValue) * plotHeight,
    value: d.engagement,
    day: d.day,
  }));

  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaData = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="chart-container engagement-chart">
      <h3 className="chart-title">Engagement</h3>
      <p className="chart-subtitle">Last 7 Days</p>
      <svg width="100%" height="250" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="engagementGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4F7DFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4F7DFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`h-${i}`}
            x1={padding}
            y1={padding + (i / 4) * plotHeight}
            x2={width - padding}
            y2={padding + (i / 4) * plotHeight}
            stroke="#e5e7eb"
            strokeDasharray="3 3"
          />
        ))}

        {/* X axis */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" />
        
        {/* Y axis */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" />

        {/* Area fill */}
        <path d={areaData} fill="url(#engagementGradient)" />

        {/* Line */}
        <path d={pathData} stroke="#4F7DFF" strokeWidth="2" fill="none" />

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={`point-${i}`} cx={p.x} cy={p.y} r="3" fill="#4F7DFF" />
        ))}

        {/* X axis labels */}
        {points.map((p, i) => (
          <text
            key={`label-${i}`}
            x={p.x}
            y={height - padding + 20}
            textAnchor="middle"
            fontSize="12"
            fill="#9ca3af"
          >
            {p.day}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default EngagementChart;
