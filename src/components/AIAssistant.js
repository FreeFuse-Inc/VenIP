import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventContext, getLocalDateString } from '../context/EventContext';
import { RoleContext } from '../context/RoleContext';
import '../styles/AIAssistant.css';

const AIAssistant = ({ chatGPTConnected, chatGPTKey }) => {
  const { userRole } = useContext(RoleContext);
  const { getEventsByRole, createEvent, createEventWithSponsorship } = useContext(EventContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! 👋 I\'m VenIP Assistant. I can help you:\n• View your events and sponsorships\n• Create new events\n• Navigate the app\n• Answer questions about your role\n\nWhat would you like help with?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const systemPrompt = `You are VenIP Assistant, a helpful AI guide for the VenIP event management platform with access to event management functions. 

VenIP has three main roles:

1. NPO (Event Organizer):
   - Create and manage events
   - Dashboard with event metrics (Total Events, Pending Vendor Quotes, Upcoming Events)
   - Browse and invite vendors for services
   - Request quotes from vendors
   - Manage event budget and timeline
   - Access: /dashboard/npo, /create-event, /event-management/:eventId

2. Vendor (Service Provider):
   - Browse available events needing services
   - Submit quotes for events
   - Suggest new events to organize
   - Track active quotes and job progress
   - Manage vendor checklist and deliverables
   - Access: /dashboard/vendor, /browse-events, /submit-quote/:eventId, /vendor-checklist

3. Sponsor (Event Sponsor):
   - Browse available events to sponsor
   - View sponsorship packages (Bronze, Silver, Gold, Platinum)
   - Track sponsorship analytics and ROI
   - Manage sponsorship renewals
   - Book accommodations for events
   - View sponsorship calendar with booking dates
   - Access: /dashboard/sponsor, /events-feed, /accommodation-bookings, /sponsorship-bookings

Help users:
- Navigate between pages and features
- Understand what they can do in their role
- Answer questions about sponsorships, vendor management, event creation
- Guide them to specific features
- Explain the platform workflow

Be friendly, concise, and helpful. Keep responses under 150 words.

Available Functions:
1. "get_events" - Get all events for the user's current role
   - Parameters: none
   - Returns: List of events with id, name, date, status, and description

2. "create_event" - Create a new event
   - Parameters: name (string), date (YYYY-MM-DD), type (string), location (string), description (string), attendees (number)
   - Returns: Newly created event object

When user asks about their events, use get_events function.
When user wants to create an event, use create_event function with appropriate parameters.
IMPORTANT: Today's date is ${new Date().toLocaleDateString()}. Always use today's date (${new Date().toISOString().split('T')[0]}) unless the user explicitly specifies a different date.
Provide links to view event details using format: "View details: /event-management/{eventId}"
Always confirm actions and provide summaries.`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processFunctionCall = async (functionName, functionInput) => {
    try {
      if (functionName === 'get_events') {
        const currentDate = getLocalDateString();
        const roleEvents = getEventsByRole(userRole, currentDate);
        return {
          success: true,
          data: roleEvents,
          message: `Found ${roleEvents.length} events for ${userRole} role on ${currentDate}`,
        };
      } else if (functionName === 'create_event') {
        const result = createEventWithSponsorship(functionInput);
        return {
          success: true,
          data: result.event,
          sponsorship: result.sponsorship,
          message: `Event "${result.event.name}" created successfully for ${result.event.date}!`,
        };
      }
      return { success: false, message: 'Unknown function' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!chatGPTConnected || !chatGPTKey) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), type: 'user', text: input },
        {
          id: Date.now() + 1,
          type: 'bot',
          text: '⚠️ ChatGPT API is not connected. Please connect it in Settings to use this feature.',
        },
      ]);
      setInput('');
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${chatGPTKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            ...messages.map((msg) => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.text,
            })),
            {
              role: 'user',
              content: input,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      let responseText = data.choices[0].message.content;

      // Check if response contains function call hints
      if (responseText.includes('get_events') || input.toLowerCase().includes('event')) {
        const eventsResult = await processFunctionCall('get_events', {});
        if (eventsResult.success) {
          if (eventsResult.data.length > 0) {
            responseText += '\n\n📋 Your Events for Today:\n';
            eventsResult.data.forEach((event) => {
              const displayName = event.name || event.eventName;
              const displayDate = event.date;
              const displayStatus = event.status;
              responseText += `• ${displayName} (${displayDate}) - ${displayStatus}\n`;
            });
          } else {
            responseText += '\n\n📋 You have no events scheduled for today.';
          }
        }
      }

      if (responseText.includes('create_event') || input.toLowerCase().includes('create')) {
        // Parse event details from user input
        let eventName = null;

        // Try various patterns to extract event name
        let match = input.match(/called\s+['"]?([^'"]+)['"]?(?:\s|$|\.)/i);
        if (!match) match = input.match(/(?:create|new)\s+(?:an?\s+)?event\s+(?:called\s+)?['"]?([^'",.]+)['"]?(?:\s|$|\.)/i);
        if (!match) match = input.match(/(?:create|new)\s+['"]([^'"]+)['"]/i);
        if (match) eventName = match[1].trim();

        const dateMatch = input.match(/date[:\s]+(\d{4}-\d{2}-\d{2})/i);

        if (eventName) {
          const currentDate = getLocalDateString();
          const eventDate = dateMatch ? dateMatch[1] : currentDate;

          const newEventResult = await processFunctionCall('create_event', {
            name: eventName,
            date: eventDate,
            type: 'general',
            location: 'TBD',
            description: input,
            attendees: 100,
          });

          if (newEventResult.success) {
            responseText += `\n\n✅ ${newEventResult.message}`;

            // Include the newly created event in the response immediately
            if (eventDate === currentDate) {
              responseText += '\n\n📋 Your Events for Today:\n';
              responseText += `• ${newEventResult.data.name} (${newEventResult.data.date}) - ${newEventResult.data.status}\n`;

              // Also fetch and show all events for today
              const allEventsResult = await processFunctionCall('get_events', {});
              if (allEventsResult.success && allEventsResult.data.length > 1) {
                responseText += '\n📋 All Your Events for Today:\n';
                allEventsResult.data.forEach((event) => {
                  const displayName = event.name || event.eventName;
                  const displayDate = event.date;
                  const displayStatus = event.status;
                  responseText += `• ${displayName} (${displayDate}) - ${displayStatus}\n`;
                });
              }
            }
          }
        }
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: responseText,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: `❌ Error: ${error.message}. Please check your API key and try again.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="ai-assistant-container">
          <div className="assistant-header">
            <div className="header-content">
              <h3>VenIP Assistant</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {userRole && (
                  <span className="role-badge">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </span>
                )}
                <span className={`status-badge ${chatGPTConnected ? 'connected' : 'disconnected'}`}>
                  {chatGPTConnected ? '● Connected' : '● Disconnected'}
                </span>
              </div>
            </div>
            <button
              className="close-assistant-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              ✕
            </button>
          </div>

          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  {message.type === 'bot' && <span className="message-icon">🤖</span>}
                  <p>{message.text}</p>
                  {message.type === 'user' && <span className="message-icon">👤</span>}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message">
                <div className="message-content">
                  <span className="message-icon">🤖</span>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={chatGPTConnected ? "Ask me anything..." : "Connect API in Settings..."}
              disabled={!chatGPTConnected || isLoading}
              className="message-input"
            />
            <button
              type="submit"
              disabled={!chatGPTConnected || isLoading || !input.trim()}
              className="send-btn"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      <button
        className={`assistant-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle assistant"
      >
        💬
      </button>
    </>
  );
};

export default AIAssistant;
