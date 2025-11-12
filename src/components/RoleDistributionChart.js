import React from 'react';
import '../styles/Charts.css';

const RoleDistributionChart = () => {
  const data = [
    { role: 'Vendors', count: 47, color: '#4F7DFF' },
    { role: 'Sponsors', count: 23, color: '#FFD93D' },
    { role: 'NPOs', count: 18, color: '#FF6B6B' },
  ];

  const total = data.reduce((sum, d) => sum + d.count, 0);
  const width = 400;
  const height = 300;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 80;

  let currentAngle = -Math.PI / 2;
  const slices = data.map((item) => {
    const sliceAngle = (item.count / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

    const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    const labelAngle = startAngle + sliceAngle / 2;
    const labelRadius = radius * 0.65;
    const labelX = centerX + labelRadius * Math.cos(labelAngle);
    const labelY = centerY + labelRadius * Math.sin(labelAngle);

    const percentage = ((item.count / total) * 100).toFixed(1);

    currentAngle = endAngle;

    return {
      path: pathData,
      color: item.color,
      labelX,
      labelY,
      percentage,
      count: item.count,
    };
  });

  return (
    <div className="chart-container role-distribution-chart">
      <h3 className="chart-title">Role Distribution</h3>
      <p className="chart-subtitle">Total Participants: {total}</p>
      
      <div className="distribution-chart-wrapper">
        <svg width="100%" height="300" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          {slices.map((slice, i) => (
            <g key={`slice-${i}`}>
              <path d={slice.path} fill={slice.color} stroke="white" strokeWidth="2" />
              <text
                x={slice.labelX}
                y={slice.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight="600"
                fill="white"
              >
                {slice.percentage}%
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="distribution-legend">
        {data.map((item, i) => (
          <div key={`legend-${i}`} className="distribution-legend-item">
            <div className="legend-color-box" style={{ backgroundColor: item.color }}></div>
            <div className="legend-info">
              <div className="legend-label">{item.role}</div>
              <div className="legend-count">{item.count} total</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleDistributionChart;
