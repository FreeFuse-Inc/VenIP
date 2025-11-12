import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventContext, getLocalDateString } from '../context/EventContext';
import { RoleContext } from '../context/RoleContext';
import '../styles/AIAssistant.css';

const AIAssistant = ({ chatGPTConnected, chatGPTKey }) => {
  const { userRole } = useContext(RoleContext);
  const { getEventsByRole, createEvent, createEventWithSponsorship, sponsorships, deleteSponsorship } = useContext(EventContext);
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

When user asks about their events, respond helpfully and mention you can fetch their calendar.
When user wants to create an event, create it with their specified details.
IMPORTANT: Always use today's date for new events unless the user explicitly specifies a different date.
When confirming event creation, be clear about the date and title.
Provide helpful guidance and always confirm actions.`;

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
      } else if (functionName === 'delete_event') {
        const { eventName, date } = functionInput;

        // Find sponsorships to delete based on date and optionally event name
        const sponsorshipsToDelete = sponsorships.filter((s) => {
          if (!s || !s.date) return false;
          const dateMatch = s.date === date;
          const nameMatch = !eventName || (s.eventName && s.eventName.toLowerCase() === eventName.toLowerCase());
          return dateMatch && nameMatch;
        });

        if (sponsorshipsToDelete.length === 0) {
          return {
            success: false,
            message: eventName
              ? `No event named "${eventName}" found on ${date}`
              : `No events found on ${date}. Current sponsorships: ${sponsorships.map(s => s.eventName + ' on ' + s.date).join(', ') || 'none'}`,
          };
        }

        // Delete all matching sponsorships
        sponsorshipsToDelete.forEach((s) => {
          deleteSponsorship(s.id);
        });

        return {
          success: true,
          data: sponsorshipsToDelete,
          message: sponsorshipsToDelete.length === 1
            ? `Event "${sponsorshipsToDelete[0].eventName}" deleted successfully!`
            : `${sponsorshipsToDelete.length} events deleted successfully!`,
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
      let isDeleteRequest = false;

      // FIRST: Check if this is a delete request BEFORE anything else
      // This ensures delete always takes priority over ChatGPT response
      const hasDeleteKeyword = /\b(delete|remove|cancel)\b/i.test(input);
      const hasCreateKeyword = /\b(create|new|add)\b/i.test(input);
      const hasEventKeyword = /(event|sponsorship|activity)/i.test(input);

      if (hasDeleteKeyword && hasEventKeyword && !hasCreateKeyword) {
        isDeleteRequest = true;
        // For now, override the response immediately
        responseText = '⏳ Processing delete request...';
      }

      // Function to parse various date formats (used for both create and delete)
      const parseEventDate = (inputText) => {
        const now = new Date();
        const currentYear = now.getFullYear();

        // Check for "today" keyword
        if (/\btoday\b/i.test(inputText)) {
          return getLocalDateString();
        }

        // Check for explicit YYYY-MM-DD format
        let dateMatch = inputText.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (dateMatch) return `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;

        // Check for month name or abbreviation with day
        const monthPattern = /(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})(?:st|nd|rd|th)?/i;
        dateMatch = inputText.match(monthPattern);
        if (dateMatch) {
          const monthStr = dateMatch[0].split(/\s+/)[0];
          const day = parseInt(dateMatch[1]);
          const months = {
            'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
            'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11,
            'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
          };
          const month = months[monthStr.toLowerCase()];
          if (month !== undefined) {
            const eventDate = new Date(currentYear, month, day);
            const year = eventDate.getFullYear();
            const m = String(month + 1).padStart(2, '0');
            const d = String(day).padStart(2, '0');
            return `${year}-${m}-${d}`;
          }
        }

        // Check for slash format (MM/DD or M/D)
        dateMatch = inputText.match(/(\d{1,2})\/(\d{1,2})/);
        if (dateMatch) {
          const month = parseInt(dateMatch[1]);
          const day = parseInt(dateMatch[2]);
          if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            const m = String(month).padStart(2, '0');
            const d = String(day).padStart(2, '0');
            return `${currentYear}-${m}-${d}`;
          }
        }

        // Check for "the Xth" pattern
        dateMatch = inputText.match(/(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)?/i);
        if (dateMatch) {
          const day = parseInt(dateMatch[1]);
          if (day >= 1 && day <= 31) {
            const currentMonth = now.getMonth();
            const m = String(currentMonth + 1).padStart(2, '0');
            const d = String(day).padStart(2, '0');
            return `${currentYear}-${m}-${d}`;
          }
        }

        // Default to today
        return getLocalDateString();
      };

      // Check if user explicitly asks to see/view events (but don't fetch if creating or deleting)
      const askingToViewEvents = /(show|view|list|tell|get)\b.*\b(events?|schedule|calendar)/i.test(input);
      const isDeletingOrCreating = /(delete|remove|cancel|create|new|add)\b/i.test(input);

      if ((responseText.includes('get_events') || askingToViewEvents) && !isDeletingOrCreating) {
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

        if (eventName) {
          const currentDate = getLocalDateString();
          const eventDate = parseEventDate(input);

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

            // Show the newly created event and sponsorship
            responseText += '\n\n📋 Event Successfully Created:\n';
            responseText += `• ${newEventResult.data.name} (${newEventResult.data.date}) - ${newEventResult.data.status}\n`;

            if (eventDate === currentDate) {
              responseText += '\n✅ The event has been added to your calendar for today!';
            }
          }
        }
      }

      // Handle delete event requests - check BEFORE ChatGPT response is processed
      // This ensures we intercept delete requests regardless of what ChatGPT says
      const deleteKeywordMatch = /\b(delete|remove|cancel)\b/i.test(input);
      const eventKeywordMatch = /(event|sponsorship|activity)/i.test(input);

      if (deleteKeywordMatch && eventKeywordMatch) {
        isDeleteRequest = true;

        // Check available sponsorships for debugging
        const availableSponsorships = sponsorships && sponsorships.length > 0
          ? sponsorships.map(s => `${s.eventName} on ${s.date}`).join(', ')
          : 'none';

        // Parse event name if specified (but not "all" or generic terms)
        let eventNameToDelete = null;

        // Check if user is trying to delete all events
        const isDeleteAll = /(?:delete|remove|cancel)\s+(?:all\s+)?(?:events?|sponsorships?)/i.test(input);

        if (!isDeleteAll) {
          // Try to extract a specific event name
          let nameMatch = input.match(/(?:delete|remove|cancel)\s+(?:the\s+)?(?:event\s+)?(?:called\s+)?['"]?([^'"]+?)['"]?(?:\s+(?:on|for|at|from)|$)/i);
          if (nameMatch) {
            const extracted = nameMatch[1].trim();
            // Make sure we didn't extract generic terms
            if (!extracted.toLowerCase().match(/^(all|events?|for|on|at|today|tomorrow|the|this)$/) && extracted.length > 1) {
              eventNameToDelete = extracted;
            }
          }
        }

        // Parse the date
        const dateToDelete = parseEventDate(input);

        if (dateToDelete) {
          try {
            // Ensure sponsorships is an array
            const sponsorshipsArray = Array.isArray(sponsorships) ? sponsorships : [];

            // Find matching sponsorships manually first to verify they exist
            const matchingSponsorships = sponsorshipsArray.filter(s => {
              if (!s || !s.date) return false;
              const dateMatches = s.date === dateToDelete;
              const nameMatches = !eventNameToDelete || (s.eventName && s.eventName.toLowerCase() === eventNameToDelete.toLowerCase());
              return dateMatches && nameMatches;
            });

            if (matchingSponsorships.length > 0) {
              // Delete them one by one
              let deletedCount = 0;
              matchingSponsorships.forEach(s => {
                try {
                  deleteSponsorship(s.id);
                  deletedCount++;
                } catch (deleteErr) {
                  console.error('Error deleting sponsorship:', deleteErr);
                }
              });

              responseText = `✅ Successfully deleted ${deletedCount} event(s) from ${dateToDelete}`;
              responseText += '\n📅 The calendar has been updated.';
            } else {
              // No matches found - show diagnostic info
              responseText = `❌ No events found on ${dateToDelete}.`;
              if (availableSponsorships !== 'none') {
                responseText += `\nAvailable events: ${availableSponsorships}`;
              }
            }
          } catch (err) {
            console.error('Delete error:', err);
            responseText = `❌ Error deleting event: ${err.message}`;
          }
        } else {
          responseText = `❌ I couldn't determine which date to delete events from. Please specify a date like "today", "the 12th", or "November 14".`;
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
