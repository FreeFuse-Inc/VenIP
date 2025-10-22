import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import Sidebar from './components/Sidebar';
import MetricCard from './components/MetricCard';
import TrafficChart from './components/TrafficChart';
import BounceRateChart from './components/BounceRateChart';
import EngagementChart from './components/EngagementChart';
import VendorList from './components/VendorList';
import RoleSelection from './pages/RoleSelection';
import NPODashboard from './pages/NPODashboard';
import VendorDashboard from './pages/VendorDashboard';
import SponsorDashboard from './pages/SponsorDashboard';
import CreateEvent from './pages/CreateEvent';
import Venues from './pages/Venues';
import Bookings from './pages/Bookings';
import Vendors from './pages/Vendors';
import Settings from './pages/Settings';
import EventManagement from './pages/EventManagement';
import './App.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();
  const isRoleSelectionPage = location.pathname === '/';

  return (
    <div className="app-container">
      {!isRoleSelectionPage && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} showRoleSelection={false} />}
      
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/dashboard/npo" element={<NPODashboard />} />
        <Route path="/dashboard/vendor" element={<VendorDashboard />} />
        <Route path="/dashboard/sponsor" element={<SponsorDashboard />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="/dashboard/analytics"
          element={
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
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <RoleProvider>
      <Router>
        <AppContent />
      </Router>
    </RoleProvider>
  );
}

export default App;
