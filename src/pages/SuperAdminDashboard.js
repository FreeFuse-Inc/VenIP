import React, { useState } from 'react';
import MetricCard from '../components/MetricCard';
import SystemKPIChart from '../components/SystemKPIChart';
import RevenueTrendChart from '../components/RevenueTrendChart';
import RoleDistributionChart from '../components/RoleDistributionChart';
import '../styles/SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all-time');

  const systemKPIs = {
    totalVendors: 47,
    totalSponsors: 23,
    totalNPOs: 18,
    totalEvents: 156,
    totalRevenue: 425000,
    totalEngagement: 89450,
  };

  const vendorsData = [
    { id: 1, name: 'Premium Catering Co.', status: 'active', events: 12, revenue: 45000, engagement: 2450 },
    { id: 2, name: 'Elite Photography', status: 'active', events: 8, revenue: 28000, engagement: 1890 },
    { id: 3, name: 'Floral Designs Inc.', status: 'active', events: 15, revenue: 35000, engagement: 2100 },
    { id: 4, name: 'Event Setup Pro', status: 'inactive', events: 5, revenue: 12000, engagement: 980 },
    { id: 5, name: 'Catering Masters', status: 'active', events: 10, revenue: 38000, engagement: 2200 },
  ];

  const sponsorsData = [
    { id: 1, name: 'Global Innovations Inc.', status: 'active', sponsorships: 2, investment: 15000, reach: 7200 },
    { id: 2, name: 'Fortune 500 Corp', status: 'active', sponsorships: 5, investment: 75000, reach: 15400 },
    { id: 3, name: 'Tech Ventures LLC', status: 'active', sponsorships: 3, investment: 35000, reach: 8900 },
    { id: 4, name: 'Startup Fund', status: 'pending', sponsorships: 1, investment: 8000, reach: 2100 },
    { id: 5, name: 'Community Partners', status: 'active', sponsorships: 4, investment: 48000, reach: 12300 },
  ];

  const nposData = [
    { id: 1, name: 'Community Hearts Foundation', status: 'active', events: 8, totalBudget: 85000, volunteers: 234 },
    { id: 2, name: 'Global Relief Initiative', status: 'active', events: 12, totalBudget: 156000, volunteers: 456 },
    { id: 3, name: 'Youth Empowerment Center', status: 'active', events: 6, totalBudget: 62000, volunteers: 178 },
    { id: 4, name: 'Education First NGO', status: 'planning', events: 3, totalBudget: 42000, volunteers: 89 },
    { id: 5, name: 'Environmental Alliance', status: 'active', events: 10, totalBudget: 98000, volunteers: 312 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      case 'planning':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredVendors = vendorsData.filter(vendor => {
    if (filterRole !== 'all' && filterRole !== 'vendors') return false;
    if (filterStatus !== 'all' && vendor.status !== filterStatus) return false;
    return true;
  });

  const filteredSponsors = sponsorsData.filter(sponsor => {
    if (filterRole !== 'all' && filterRole !== 'sponsors') return false;
    if (filterStatus !== 'all' && sponsor.status !== filterStatus) return false;
    return true;
  });

  const filteredNPOs = nposData.filter(npo => {
    if (filterRole !== 'all' && filterRole !== 'npos') return false;
    if (filterStatus !== 'all' && npo.status !== filterStatus) return false;
    return true;
  });

  return (
    <main className="super-admin-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Super Admin Dashboard</h1>
          <p className="dashboard-subtitle">System-wide monitoring and KPI visualization</p>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="kpi-metrics-section">
          <MetricCard label="Total Vendors" value={systemKPIs.totalVendors} icon="🛠️" />
          <MetricCard label="Total Sponsors" value={systemKPIs.totalSponsors} icon="⭐" />
          <MetricCard label="Total NPOs" value={systemKPIs.totalNPOs} icon="🎯" />
          <MetricCard label="Total Events" value={systemKPIs.totalEvents} icon="📅" />
          <MetricCard label="Total Revenue" value={`$${(systemKPIs.totalRevenue / 1000).toFixed(0)}K`} icon="💰" />
          <MetricCard label="Total Engagement" value={systemKPIs.totalEngagement.toLocaleString()} icon="👥" />
        </section>

        <section className="charts-section">
          <SystemKPIChart />
          <RevenueTrendChart />
          <RoleDistributionChart />
        </section>

        <section className="filters-section">
          <div className="filter-group">
            <label>Filter by Role</label>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="filter-select">
              <option value="all">All Roles</option>
              <option value="vendors">Vendors Only</option>
              <option value="sponsors">Sponsors Only</option>
              <option value="npos">NPOs Only</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Filter by Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="planning">Planning</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date Range</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="filter-select">
              <option value="all-time">All Time</option>
              <option value="last-30">Last 30 Days</option>
              <option value="last-90">Last 90 Days</option>
              <option value="last-year">Last Year</option>
            </select>
          </div>
        </section>

        {(filterRole === 'all' || filterRole === 'vendors') && (
          <section className="organizations-section">
            <h2 className="section-title">Vendors Overview</h2>
            <div className="table-container">
              <table className="organizations-table">
                <thead>
                  <tr>
                    <th>Vendor Name</th>
                    <th>Status</th>
                    <th>Active Events</th>
                    <th>Revenue</th>
                    <th>Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="table-row">
                      <td className="name-cell">{vendor.name}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(vendor.status) }}
                        >
                          {getStatusLabel(vendor.status)}
                        </span>
                      </td>
                      <td className="metric-cell">{vendor.events}</td>
                      <td className="metric-cell">${vendor.revenue.toLocaleString()}</td>
                      <td className="metric-cell">{vendor.engagement.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {(filterRole === 'all' || filterRole === 'sponsors') && (
          <section className="organizations-section">
            <h2 className="section-title">Sponsors Overview</h2>
            <div className="table-container">
              <table className="organizations-table">
                <thead>
                  <tr>
                    <th>Sponsor Name</th>
                    <th>Status</th>
                    <th>Active Sponsorships</th>
                    <th>Total Investment</th>
                    <th>Audience Reach</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSponsors.map((sponsor) => (
                    <tr key={sponsor.id} className="table-row">
                      <td className="name-cell">{sponsor.name}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(sponsor.status) }}
                        >
                          {getStatusLabel(sponsor.status)}
                        </span>
                      </td>
                      <td className="metric-cell">{sponsor.sponsorships}</td>
                      <td className="metric-cell">${sponsor.investment.toLocaleString()}</td>
                      <td className="metric-cell">{sponsor.reach.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {(filterRole === 'all' || filterRole === 'npos') && (
          <section className="organizations-section">
            <h2 className="section-title">NPOs Overview</h2>
            <div className="table-container">
              <table className="organizations-table">
                <thead>
                  <tr>
                    <th>Organization Name</th>
                    <th>Status</th>
                    <th>Active Events</th>
                    <th>Total Budget</th>
                    <th>Volunteers</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNPOs.map((npo) => (
                    <tr key={npo.id} className="table-row">
                      <td className="name-cell">{npo.name}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(npo.status) }}
                        >
                          {getStatusLabel(npo.status)}
                        </span>
                      </td>
                      <td className="metric-cell">{npo.events}</td>
                      <td className="metric-cell">${npo.totalBudget.toLocaleString()}</td>
                      <td className="metric-cell">{npo.volunteers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default SuperAdminDashboard;
