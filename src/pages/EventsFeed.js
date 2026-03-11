import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import BackButton from '../components/BackButton';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import EventImageCard from '../components/EventImageCard';
import { EventContext } from '../context/EventContext';
import '../styles/EventsFeed.css';

const EventsFeed = () => {
  const navigate = useNavigate();
  const { events } = useContext(EventContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Map events from context to display format with images
  const availableEvents = useMemo(() => {
    const eventImages = {
      'Summer Charity Gala': 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Annual Gala 2024': 'https://images.pexels.com/photos/1709003/pexels-photo-1709003.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Tech Conference 2025': 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Community Wellness Summit': 'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=600',
    };

    const categoryMap = {
      'charity': 'Charity',
      'business': 'Business',
      'health': 'Health',
      'wedding': 'Social',
    };

    return events.map(event => {
      // Format date for display
      const dateObj = new Date(event.date);
      const formattedDate = dateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });

      return {
        id: event.id,
        name: event.name,
        category: categoryMap[event.type] || 'Other',
        date: formattedDate,
        time: event.time || '18:00',
        location: event.location,
        description: event.description || 'Join us for this exciting event',
        expectedAttendees: String(event.attendees || 200),
        status: event.status === 'Active' ? 'Published' : event.status,
        image: eventImages[event.name] || 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=600',
      };
    });
  }, [events]);

  const categories = ['All', 'Published', 'Planning', 'Draft', 'Completed'];

  const filteredEvents = availableEvents.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || event.status === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="events-feed">
      <BackButton />
      <PageHeader
        title="Events"
        showBack={false}
      />

      <div className="feed-content">
        <div className="feed-controls">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search events..."
          />
          
          <FilterTabs 
            tabs={categories}
            activeTab={filterCategory}
            onChange={setFilterCategory}
          />
        </div>

        <div className="events-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventImageCard 
                key={event.id}
                event={event}
                onClick={() => navigate(`/sponsor-event-details/${event.id}`)}
              />
            ))
          ) : (
            <div className="no-events">
              <p>No events found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default EventsFeed;
