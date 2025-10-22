import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MetricCard from './components/MetricCard';
import TrafficChart from './components/TrafficChart';
import BounceRateChart from './components/BounceRateChart';
import EngagementChart from './components/EngagementChart';
import VendorList from './components/VendorList';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Analytics Dashboard</h1>
          <div className="header-right">
            <span className="powered-by-text">Powered by</span>
            <div className="freefuse-badge">
              <span className="freefuse-icon">🎨</span>
              <span className="freefuse-text">FreeFuse</span>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="metrics-section">
            <MetricCard 
              label="Total Visits" 
              value="45,287" 
            />
            <MetricCard 
              label="Avg. Engagement" 
              value="1 min 24 sec" 
            />
            <VendorList title="Top Vendors" />
          </section>

          <section className="charts-section">
            <TrafficChart />
            
            <div className="session-bounce-section">
              <div className="session-info">
                <h3 className="session-title">Avg. Session→</h3>
                <p className="session-value">1m 24s</p>
              </div>
              <BounceRateChart />
            </div>

            <EngagementChart />
          </section>

          <section className="vendors-section">
            <VendorList title="Top Vendors" />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
