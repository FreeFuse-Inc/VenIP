import React, { useState, useEffect } from 'react';
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
import EventDetailsVendor from './pages/EventDetailsVendor';
import SubmitQuote from './pages/SubmitQuote';
import VendorChecklist from './pages/VendorChecklist';
import SuggestEvent from './pages/SuggestEvent';
import EventsFeed from './pages/EventsFeed';
import SponsorEventDetails from './pages/SponsorEventDetails';
import SponsorshipPackageSelection from './pages/SponsorshipPackageSelection';
import PaymentConfirmation from './pages/PaymentConfirmation';
import SponsorshipAnalytics from './pages/SponsorshipAnalytics';
import ModifySponsor from './pages/ModifySponsor';
import RenewalDecision from './pages/RenewalDecision';
import InviteAttendees from './pages/InviteAttendees';
import RequestVendors from './pages/RequestVendors';
import SponsorshipBookings from './pages/SponsorshipBookings';
import './App.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();
  const isRoleSelectionPage = location.pathname === '/';

  useEffect(() => {
    if (location.pathname.match(/^\/dashboard\/(npo|vendor|sponsor)$/)) {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

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
        <Route path="/create-event/:eventId" element={<CreateEvent />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/event-management/:eventId" element={<EventManagement />} />
        <Route path="/event-details-vendor/:eventId" element={<EventDetailsVendor />} />
        <Route path="/submit-quote/:eventId" element={<SubmitQuote />} />
        <Route path="/vendor-checklist" element={<VendorChecklist />} />
        <Route path="/suggest-event" element={<SuggestEvent />} />
        <Route path="/events-feed" element={<EventsFeed />} />
        <Route path="/sponsor-event-details/:eventId" element={<SponsorEventDetails />} />
        <Route path="/sponsorship-package-selection/:eventId/:tier" element={<SponsorshipPackageSelection />} />
        <Route path="/payment-confirmation/:eventId/:tier/:amount" element={<PaymentConfirmation />} />
        <Route path="/sponsorship-analytics" element={<SponsorshipAnalytics />} />
        <Route path="/sponsorship-analytics/:sponsorshipId" element={<SponsorshipAnalytics />} />
        <Route path="/modify-sponsorship/:sponsorshipId" element={<ModifySponsor />} />
        <Route path="/renewal-decision/:sponsorshipId" element={<RenewalDecision />} />
        <Route path="/invite-attendees/:eventId" element={<InviteAttendees />} />
        <Route path="/request-vendors/:eventId" element={<RequestVendors />} />
        <Route path="/sponsorship-bookings" element={<SponsorshipBookings />} />
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
