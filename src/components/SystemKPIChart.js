import React from 'react';
import '../styles/Charts.css';

const SystemKPIChart = () => {
  const data = [
    { week: 'W1', vendors: 12, sponsors: 5, npos: 3 },
    { week: 'W2', vendors: 15, sponsors: 6, npos: 4 },
    { week: 'W3', vendors: 18, sponsors: 8, npos: 5 },
    { week: 'W4', vendors: 22, sponsors: 10, npos: 6 },
    { week: 'W5', vendors: 28, sponsors: 14, npos: 8 },
    { week: 'W6', vendors: 35, sponsors: 18, npos: 11 },
    { week: 'W7', vendors: 42, sponsors: 20, npos: 15 },
    { week: 'W8', vendors: 47, sponsors: 23, npos: 18 },
  ];

  const maxVendors = Math.max(...data.map(d => d.vendors));
  const width = 500;
  const height = 300;
  const padding = 50;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  const vendorPoints = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * plotWidth,
    y: height - padding - (d.vendors / maxVendors) * plotHeight,
    value: d.vendors,
    week: d.week,
  }));

  const sponsorPoints = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * plotWidth,
    y: height - padding - (d.sponsors / maxVendors) * plotHeight,
    value: d.sponsors,
  }));

  const npoPoints = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * plotWidth,
    y: height - padding - (d.npos / maxVendors) * plotHeight,
    value: d.npos,
  }));

  const vendorPath = vendorPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const sponsorPath = sponsorPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const npoPath = npoPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="chart-container system-kpi-chart">
      <h3 className="chart-title">Role Growth Trend</h3>
      <p className="chart-subtitle">Last 8 Weeks</p>
      <svg width="100%" height="300" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="vendorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
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
        {vendorPoints.map((p, i) => (
          <text key={`x-label-${i}`} x={p.x} y={height - padding + 20} textAnchor="middle" fontSize="12" fill="#6b7280">
            {data[i].week}
          </text>
        ))}

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = height - padding - (i / 4) * plotHeight;
          const value = Math.round((i / 4) * maxVendors);
          return (
            <text key={`y-label-${i}`} x={padding - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#6b7280">
              {value}
            </text>
          );
        })}

        {/* Vendor line */}
        <path d={vendorPath} stroke="#D4AF37" strokeWidth="2.5" fill="none" />
        
        {/* Sponsor line */}
        <path d={sponsorPath} stroke="#FFD93D" strokeWidth="2.5" fill="none" />
        
        {/* NPO line */}
        <path d={npoPath} stroke="#FF6B6B" strokeWidth="2.5" fill="none" />

        {/* Data points for vendors */}
        {vendorPoints.map((p, i) => (
          <circle key={`vendor-point-${i}`} cx={p.x} cy={p.y} r="3" fill="#D4AF37" />
        ))}

        {/* Data points for sponsors */}
        {sponsorPoints.map((p, i) => (
          <circle key={`sponsor-point-${i}`} cx={p.x} cy={p.y} r="3" fill="#FFD93D" />
        ))}

        {/* Data points for NPOs */}
        {npoPoints.map((p, i) => (
          <circle key={`npo-point-${i}`} cx={p.x} cy={p.y} r="3" fill="#FF6B6B" />
        ))}
      </svg>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#D4AF37' }}></span>
          <span>Vendors</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#FFD93D' }}></span>
          <span>Sponsors</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#FF6B6B' }}></span>
          <span>NPOs</span>
        </div>
      </div>
    </div>
  );
};

export default SystemKPIChart;
