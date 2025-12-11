import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventContext, getLocalDateString } from '../context/EventContext';
import { RoleContext } from '../context/RoleContext';
import { ZIndexContext } from '../context/ZIndexContext';
import '../styles/AIAssistant.css';

const AIAssistant = ({ chatGPTConnected, chatGPTKey }) => {
  const { userRole } = useContext(RoleContext);
  const { getEventsByRole, createEvent, createEventWithSponsorship, sponsorships, deleteSponsorship, events, deleteEvent } = useContext(EventContext);
  const { zIndexMap, raiseZIndex } = useContext(ZIndexContext);
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

  const getSystemPrompt = () => {
    const currentDate = getLocalDateString();
    const dateObj = new Date();
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' });
    const dayNum = dateObj.getDate();
    const year = dateObj.getFullYear();

    return `You are VenIP Assistant, a helpful AI guide for the VenIP event management platform with access to event management functions.

CURRENT DATE: ${dayName}, ${monthName} ${dayNum}, ${year}
Today's date in YYYY-MM-DD format: ${currentDate}
Always use "${currentDate}" when the user refers to "today" or the current date.

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

3. "delete_event" - Delete an existing event
   - Parameters: eventName (string, optional), date (YYYY-MM-DD, optional)
   - Returns: Confirmation of deletion

SUPPORTED DATE FORMATS FOR EVENT CREATION AND DELETION:
- "today" → Uses today's date
- "tomorrow" → Uses tomorrow's date
- "next Monday/Tuesday/etc" → Uses the next occurrence of that day
- "next week" → Uses 7 days from today
- "next month" → Uses same day next month
- "March 15" or "March 15 2026" → Specific month and day
- "3/15" or "3/15/2026" → Slash format with optional year
- "the 15th" or "the 15th of March" → Written format
- "2026-03-15" → ISO format YYYY-MM-DD
- Year can be specified with any date format (defaults to current year if not specified)

When user asks about their events, respond helpfully and mention you can fetch their calendar.
When user wants to create an event, create it with their specified details using the date they provide.
IMPORTANT: Parse dates carefully from user input. Support all common date formats listed above.
When user specifies a date like "tomorrow" or "next Friday", use that exact date for the event.
When confirming event creation, be clear about the date and title.
When deleting events, support deletion by event name, date, or both.
Provide helpful guidance and always confirm actions.`;
  };

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
        let deletedEvents = [];
        let deletedSponsorships = [];

        // Try to find and delete matching events
        if (events && events.length > 0) {
          const eventsToDelete = events.filter((e) => {
            if (!e) return false;
            const dateMatch = !date || e.date === date;
            const nameMatch = !eventName || (e.name && e.name.toLowerCase() === eventName.toLowerCase());
            return dateMatch && nameMatch;
          });

          eventsToDelete.forEach((e) => {
            try {
              deleteEvent(e.id);
              deletedEvents.push(e);
            } catch (err) {
              console.error('Error deleting event:', err);
            }
          });
        }

        // Try to find and delete matching sponsorships
        if (sponsorships && sponsorships.length > 0) {
          const sponsorshipsToDelete = sponsorships.filter((s) => {
            if (!s || !s.date) return false;
            const dateMatch = !date || s.date === date;
            const nameMatch = !eventName || (s.eventName && s.eventName.toLowerCase() === eventName.toLowerCase());
            return dateMatch && nameMatch;
          });

          sponsorshipsToDelete.forEach((s) => {
            try {
              deleteSponsorship(s.id);
              deletedSponsorships.push(s);
            } catch (err) {
              console.error('Error deleting sponsorship:', err);
            }
          });
        }

        const totalDeleted = deletedEvents.length + deletedSponsorships.length;

        if (totalDeleted === 0) {
          const availableEvents = events?.map(e => e.name + ' on ' + e.date).join(', ') || 'none';
          const availableSponsorships = sponsorships?.map(s => s.eventName + ' on ' + s.date).join(', ') || 'none';
          return {
            success: false,
            message: eventName
              ? `No event named "${eventName}" found${date ? ` on ${date}` : ''}`
              : `No events found${date ? ` on ${date}` : ''}\nAvailable: ${availableEvents || availableSponsorships}`,
          };
        }

        return {
          success: true,
          data: { events: deletedEvents, sponsorships: deletedSponsorships },
          message: totalDeleted === 1
            ? `Event deleted successfully!`
            : `${totalDeleted} events deleted successfully!`,
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
              content: getSystemPrompt(),
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
        let currentYear = now.getFullYear();
        let targetYear = currentYear;

        // Check for year specification (e.g., "2026", "next year", "2025")
        let yearMatch = inputText.match(/\b(20\d{2}|next\s+year|this\s+year)\b/i);
        if (yearMatch) {
          if (yearMatch[1].toLowerCase() === 'next year') {
            targetYear = currentYear + 1;
          } else if (yearMatch[1].toLowerCase() === 'this year') {
            targetYear = currentYear;
          } else {
            targetYear = parseInt(yearMatch[1]);
          }
        }

        // Check for "today" keyword
        if (/\btoday\b/i.test(inputText)) {
          return getLocalDateString();
        }

        // Check for "tomorrow" keyword
        if (/\btomorrow\b/i.test(inputText)) {
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const year = tomorrow.getFullYear();
          const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
          const day = String(tomorrow.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }

        // Check for "next [day]" pattern (e.g., "next Monday", "next Friday")
        const dayOfWeekPattern = /next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month)/i;
        let dayMatch = inputText.match(dayOfWeekPattern);
        if (dayMatch) {
          const dayName = dayMatch[1].toLowerCase();
          const daysOfWeek = {
            'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
            'friday': 5, 'saturday': 6, 'sunday': 0
          };

          if (dayName === 'week') {
            const nextWeek = new Date(now);
            nextWeek.setDate(nextWeek.getDate() + 7);
            const year = nextWeek.getFullYear();
            const month = String(nextWeek.getMonth() + 1).padStart(2, '0');
            const day = String(nextWeek.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          } else if (dayName === 'month') {
            const nextMonth = new Date(now);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            const year = nextMonth.getFullYear();
            const month = String(nextMonth.getMonth() + 1).padStart(2, '0');
            const day = String(nextMonth.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          } else if (daysOfWeek[dayName] !== undefined) {
            const targetDayOfWeek = daysOfWeek[dayName];
            const currentDayOfWeek = now.getDay();
            let daysAhead = targetDayOfWeek - currentDayOfWeek;
            if (daysAhead <= 0) {
              daysAhead += 7;
            }
            const nextDate = new Date(now);
            nextDate.setDate(nextDate.getDate() + daysAhead);
            const year = nextDate.getFullYear();
            const month = String(nextDate.getMonth() + 1).padStart(2, '0');
            const day = String(nextDate.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          }
        }

        // Check for explicit YYYY-MM-DD format
        let dateMatch = inputText.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (dateMatch) return `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;

        // Check for slash format (MM/DD or M/D) with optional year
        dateMatch = inputText.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/);
        if (dateMatch) {
          const month = parseInt(dateMatch[1]);
          const day = parseInt(dateMatch[2]);
          const specifiedYear = dateMatch[3] ? parseInt(dateMatch[3]) : targetYear;
          if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            const m = String(month).padStart(2, '0');
            const d = String(day).padStart(2, '0');
            return `${specifiedYear}-${m}-${d}`;
          }
        }

        // Check for month name or abbreviation with day (with optional year) - "Month Day" or "Month Day Year"
        const monthPattern = /(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s+(20\d{2}))?/i;
        dateMatch = inputText.match(monthPattern);
        if (dateMatch) {
          const fullMatch = dateMatch[0];
          const monthStr = fullMatch.split(/\s+/)[0];
          const day = parseInt(dateMatch[1]);
          const specifiedYear = dateMatch[2] ? parseInt(dateMatch[2]) : targetYear;
          const months = {
            'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
            'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11,
            'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
          };
          const month = months[monthStr.toLowerCase()];
          if (month !== undefined && day >= 1 && day <= 31) {
            const m = String(month + 1).padStart(2, '0');
            const d = String(day).padStart(2, '0');
            return `${specifiedYear}-${m}-${d}`;
          }
        }

        // Check for "the Xth [of] [month]" pattern (more specific: must have "of" or month name after)
        const thPatternFull = /(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i;
        dateMatch = inputText.match(thPatternFull);
        if (dateMatch) {
          const fullMatch = dateMatch[0];
          const day = parseInt(dateMatch[1]);
          const monthStr = fullMatch.split(/\s+/).pop().toLowerCase();
          const months = {
            'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
            'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11,
            'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
          };
          const month = months[monthStr];
          if (month !== undefined && day >= 1 && day <= 31) {
            const m = String(month + 1).padStart(2, '0');
            const d = String(day).padStart(2, '0');
            return `${targetYear}-${m}-${d}`;
          }
        }

        // Check for "the Xth" pattern (just day number) - only if NOT preceded by month name
        // Must have "the" to avoid matching random numbers
        const hasMonthName = /\b(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(inputText);
        if (!hasMonthName) {
          dateMatch = inputText.match(/\bthe\s+(\d{1,2})(?:st|nd|rd|th)?\b/i);
          if (dateMatch) {
            const day = parseInt(dateMatch[1]);
            if (day >= 1 && day <= 31) {
              const currentMonth = now.getMonth();
              const m = String(currentMonth + 1).padStart(2, '0');
              const d = String(day).padStart(2, '0');
              return `${targetYear}-${m}-${d}`;
            }
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

      // Only handle create if it's not a delete request
      if (!isDeleteRequest && (responseText.includes('create_event') || input.toLowerCase().includes('create'))) {
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
            responseText += `• Event: ${newEventResult.data.name}\n`;
            responseText += `• Date: ${newEventResult.data.date}\n`;
            responseText += `• Status: ${newEventResult.data.status}\n`;

            // Parse the user's date request to show what they asked for
            const dateRequestText = input.match(/(?:on|for|tomorrow|today|next\s+\w+|\d{1,2}\/\d{1,2}|\w+\s+\d{1,2})[^.!?,]*(?=[.!?,]|$)/i);
            if (dateRequestText) {
              responseText += `\n✅ Created for: ${dateRequestText[0].trim()}`;
            }
          }
        }
      }

      // Handle delete event requests - only execute if marked as delete request from early check
      if (isDeleteRequest) {
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
          // Try multiple patterns to find the event name
          let extracted = null;

          // Pattern 1: "delete [the] "EventName" [from/on ...]"
          let nameMatch = input.match(/(?:delete|remove|cancel)\s+(?:the\s+)?['"]([^'"]+)['"]/i);
          if (nameMatch) {
            extracted = nameMatch[1].trim();
          }

          // Pattern 2: "delete [the] EventName [event/sponsorship] [from/on ...]"
          if (!extracted) {
            nameMatch = input.match(/(?:delete|remove|cancel)\s+(?:the\s+)?([^"']+?)(?:\s+(?:event|sponsorship|activity|from|for|on|at)|$)/i);
            if (nameMatch) {
              extracted = nameMatch[1].trim();
              // Remove trailing "event", "sponsorship", "activity" if they were included
              extracted = extracted.replace(/\s+(?:event|sponsorship|activity|from|for|on|at).*$/i, '').trim();
            }
          }

          // Pattern 3: Fallback - extract anything that looks like an event name
          if (!extracted) {
            nameMatch = input.match(/(?:delete|remove|cancel).*?(?:called|named|the)?\s+([A-Z][^,\n]+?)(?:\s+(?:event|sponsorship|from|on|for|at)|$)/i);
            if (nameMatch) {
              extracted = nameMatch[1].trim();
            }
          }

          // Validate extracted name
          if (extracted && !extracted.toLowerCase().match(/^(all|events?|sponsorships?|for|on|at|from|today|tomorrow|the|this|calendar)$/) && extracted.length > 1) {
            eventNameToDelete = extracted;
          }
        }

        // Parse the date - use the improved parseEventDate function
        const dateToDelete = parseEventDate(input);

        if (dateToDelete || eventNameToDelete) {
          try {
            const deleteResult = await processFunctionCall('delete_event', {
              eventName: eventNameToDelete,
              date: dateToDelete,
            });

            if (deleteResult.success) {
              responseText = `✅ ${deleteResult.message}`;

              // Show what was deleted
              if (deleteResult.data?.events?.length > 0) {
                responseText += '\n\n📋 Deleted Events:\n';
                deleteResult.data.events.forEach(e => {
                  responseText += `• ${e.name} (${e.date})\n`;
                });
              }

              if (deleteResult.data?.sponsorships?.length > 0) {
                responseText += '\n📋 Deleted Sponsorships:\n';
                deleteResult.data.sponsorships.forEach(s => {
                  responseText += `• ${s.eventName} (${s.date})\n`;
                });
              }

              responseText += '\n📅 The calendar has been updated.';
            } else {
              responseText = deleteResult.message || '❌ Could not delete the event.';
            }
          } catch (err) {
            console.error('Delete error:', err);
            responseText = `❌ Error deleting event: ${err.message}`;
          }
        } else {
          // No date and no event name - can't delete anything
          responseText = `❌ Please specify which event to delete by name (e.g., "delete VenIP Tech Demo") or provide a date (e.g., "delete tomorrow's event").`;
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

  const handleToggleAssistant = () => {
    raiseZIndex('aiAssistant');
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen && (
        <div className="ai-assistant-container" style={{ zIndex: zIndexMap.aiAssistant }}>
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
