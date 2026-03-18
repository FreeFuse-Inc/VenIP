import React, { useContext, useState, useMemo } from 'react';
import BackButton from '../components/BackButton';
import PageHeader from '../components/PageHeader';
import SponsorCard from '../components/SponsorCard';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import { EventContext } from '../context/EventContext';
import { UserContext } from '../context/UserContext';
import { RoleContext } from '../context/RoleContext';
import '../styles/NPOSponsors.css';

const NPOSponsors = () => {
  const { sponsorships, getNPOSponsors, getNPOEventIds } = useContext(EventContext);
  const { user } = useContext(UserContext);
  const { setUserRole } = useContext(RoleContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Your Partners');

  // Set user role when page loads
  React.useEffect(() => {
    setUserRole('npo');
  }, [setUserRole]);

  const tabs = ['Your Partners', 'Available Sponsors'];

  // Get NPO's event IDs
  const npoEventIds = useMemo(() => {
    return getNPOEventIds(user?.id || 'npo');
  }, [getNPOEventIds, user?.id]);

  // Get NPO's sponsors (linked to their events)
  const npoSponsors = useMemo(() => {
    return getNPOSponsors(npoEventIds);
  }, [getNPOSponsors, npoEventIds]);

  // Get all available sponsors (for discovery)
  const availableSponsors = useMemo(() => {
    // All unique sponsors from sponsorships
    const allSponsors = sponsorships.map(s => ({
      ...s,
      companyName: s.sponsorshipLevel,
      partnerships: 1,
    }));

    // Remove duplicates and sum partnerships
    const uniqueSponsors = {};
    allSponsors.forEach(sponsor => {
      const key = sponsor.sponsorshipLevel;
      if (uniqueSponsors[key]) {
        uniqueSponsors[key].partnerships += 1;
      } else {
        uniqueSponsors[key] = sponsor;
      }
    });

    return Object.values(uniqueSponsors);
  }, [sponsorships]);

  // Filter sponsors based on search
  const filteredNPOSponsors = useMemo(() => {
    return npoSponsors.filter(sponsor => {
      const query = searchQuery.toLowerCase();
      const tierName = (sponsor.sponsorshipLevel || '').toLowerCase();
      return tierName.includes(query);
    });
  }, [npoSponsors, searchQuery]);

  const filteredAvailableSponsors = useMemo(() => {
    return availableSponsors.filter(sponsor => {
      // Don't show sponsors NPO already has
      const sponsorKey = sponsor.sponsorshipLevel;
      const hasPartnership = npoSponsors.some(s => s.sponsorshipLevel === sponsorKey);

      if (hasPartnership) return false;

      const query = searchQuery.toLowerCase();
      const tierName = (sponsor.sponsorshipLevel || '').toLowerCase();
      return tierName.includes(query);
    });
  }, [availableSponsors, npoSponsors, searchQuery]);

  const handleConnectSponsor = (sponsor) => {
    // This would typically open a modal or navigate to a connection flow
    alert(`Connection request sent to ${sponsor.sponsorshipLevel} sponsor`);
  };

  // Calculate metrics
  const totalPartnershipValue = npoSponsors.reduce((sum, sponsor) => {
    const amount = sponsor.amount || '$0';
    const numericValue = parseInt(amount.replace(/[^0-9]/g, '')) || 0;
    return sum + numericValue;
  }, 0);

  const displayedSponsors = activeTab === 'Your Partners' ? filteredNPOSponsors : filteredAvailableSponsors;

  return (
    <main className="npo-sponsors-page">
      <BackButton />
      <PageHeader
        title="Sponsors & Partnerships"
        subtitle="Manage your partnerships and discover new sponsorship opportunities"
      />

      <div className="sponsors-page-content">
        {/* Metrics Section */}
        <div className="sponsors-metrics-section">
          <div className="metric-pill">
            <span className="metric-value">{npoSponsors.length}</span>
            <span className="metric-label">Your Partners</span>
          </div>
          <div className="metric-pill">
            <span className="metric-value">${(totalPartnershipValue / 1000).toFixed(0)}k</span>
            <span className="metric-label">Partnership Value</span>
          </div>
          <div className="metric-pill">
            <span className="metric-value">{availableSponsors.length}</span>
            <span className="metric-label">Available Sponsors</span>
          </div>
        </div>

        {/* Controls */}
        <div className="sponsors-controls">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search sponsors by tier level..."
          />

          <FilterTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Sponsors Grid */}
        <div className="sponsors-grid-section">
          {displayedSponsors.length > 0 ? (
            <div className="sponsors-grid">
              {displayedSponsors.map((sponsor, index) => (
                <SponsorCard
                  key={`${sponsor.id}-${index}`}
                  sponsor={sponsor}
                  onClick={() => {
                    // Could navigate to sponsor detail or open modal
                  }}
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                  showConnectButton={activeTab === 'Available Sponsors'}
                  onConnect={handleConnectSponsor}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state-sponsors">
              <div className="empty-icon">🎯</div>
              <h3>
                {activeTab === 'Your Partners'
                  ? 'No partners yet'
                  : 'No available sponsors'}
              </h3>
              <p>
                {activeTab === 'Your Partners'
                  ? 'Start by connecting with available sponsors to build your partnerships'
                  : 'All available sponsors are already your partners'}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default NPOSponsors;
