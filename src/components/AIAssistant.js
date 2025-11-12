import React, { useState, useRef, useEffect } from 'react';
import '../styles/AIAssistant.css';

const AIAssistant = ({ chatGPTConnected, chatGPTKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! 👋 I\'m VenIP Assistant. I can help you navigate the app, answer questions about your role, and guide you through features. What would you like to know?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const systemPrompt = `You are VenIP Assistant, a helpful AI guide for the VenIP event management platform. 

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

Be friendly, concise, and helpful. Keep responses under 150 words.`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: data.choices[0].message.content,
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
              <span className={`status-badge ${chatGPTConnected ? 'connected' : 'disconnected'}`}>
                {chatGPTConnected ? '● Connected' : '● Disconnected'}
              </span>
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
