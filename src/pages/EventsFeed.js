import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import EventImageCard from '../components/EventImageCard';
import '../styles/EventsFeed.css';

const EventsFeed = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const availableEvents = [
    {
      id: 1,
      name: 'Annual Charity Gala',
      category: 'Charity',
      date: 'Mar 14, 2025',
      time: '18:00',
      location: 'Grand Ballroom',
      description: 'A night of giving and celebration',
      expectedAttendees: '300',
      status: 'Published',
      image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      id: 2,
      name: 'Tech Conference 2025',
      category: 'Business',
      date: 'Apr 19, 2025',
      time: '09:00',
      location: 'Conference Center',
      description: 'Innovation and networking summit',
      expectedAttendees: '250',
      status: 'Published',
      image: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      id: 3,
      name: 'Summer Fundraiser',
      category: 'Charity',
      date: 'Jun 9, 2025',
      time: '16:00',
      location: 'Rooftop Garden',
      description: 'Summer celebration for a great cause',
      expectedAttendees: '150',
      status: 'Draft',
      image: 'https://images.pexels.com/photos/1157557/pexels-photo-1157557.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      id: 4,
      name: 'Community Wellness Summit',
      category: 'Health',
      date: 'Jan 15, 2025',
      time: '10:00',
      location: 'Central Park',
      description: 'Wellness and health awareness event',
      expectedAttendees: '200',
      status: 'Published',
      image: 'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      id: 5,
      name: 'Startup Innovation Forum',
      category: 'Business',
      date: 'Feb 10, 2025',
      time: '14:00',
      location: 'Innovation Hub',
      description: 'Connecting startups with investors',
      expectedAttendees: '180',
      status: 'Published',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  ];

  const categories = ['All', 'Published', 'Draft', 'Completed'];

  const filteredEvents = availableEvents.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || event.status === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="events-feed">
      <PageHeader 
        title="Events" 
        showBack={true}
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
