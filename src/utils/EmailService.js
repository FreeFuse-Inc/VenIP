/**
 * EmailService - Handles mock email sending and integration with Zapier and Stripe
 */

class EmailService {
  constructor() {
    this.sentEmails = JSON.parse(localStorage.getItem('sentEmails')) || [];
    this.zapierIntegration = null;
    this.stripeIntegration = null;
  }

  /**
   * Send a mock email with Zapier integration
   */
  async sendEmailViaZapier(emailData, zapierWebhookUrl) {
    try {
      // Simulate sending email via Zapier webhook
      const payload = {
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.body,
        event: 'feedback_request',
        eventId: emailData.eventId,
        eventName: emailData.eventName,
        feedbackType: emailData.feedbackType,
        timestamp: new Date().toISOString(),
      };

      // Mock API call - in production, this would hit the Zapier webhook
      console.log('📧 Sending via Zapier:', payload);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock success response
      const mockResponse = {
        id: `zapier_${Math.random().toString(36).substr(2, 9)}`,
        status: 'sent',
        service: 'zapier',
        timestamp: new Date().toISOString(),
      };

      // Store in local log
      this.logEmail({
        ...emailData,
        service: 'zapier',
        status: 'sent',
        responseId: mockResponse.id,
      });

      return mockResponse;
    } catch (error) {
      console.error('Zapier integration error:', error);
      throw new Error('Failed to send email via Zapier');
    }
  }

  /**
   * Send a mock email with Stripe integration
   */
  async sendEmailViaStripe(emailData, stripeSecretKey) {
    try {
      // Simulate sending email via Stripe customer communication
      const payload = {
        customerId: emailData.stripeCustomerId,
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.body,
        event: 'post_transaction_feedback',
        eventId: emailData.eventId,
        eventName: emailData.eventName,
        feedbackType: emailData.feedbackType,
        timestamp: new Date().toISOString(),
      };

      console.log('💳 Sending via Stripe:', payload);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock success response
      const mockResponse = {
        id: `stripe_${Math.random().toString(36).substr(2, 9)}`,
        status: 'sent',
        service: 'stripe',
        timestamp: new Date().toISOString(),
      };

      // Store in local log
      this.logEmail({
        ...emailData,
        service: 'stripe',
        status: 'sent',
        responseId: mockResponse.id,
      });

      return mockResponse;
    } catch (error) {
      console.error('Stripe integration error:', error);
      throw new Error('Failed to send email via Stripe');
    }
  }

  /**
   * Send a generic mock email
   */
  async sendEmail(emailData) {
    try {
      const mockEmail = {
        id: `email_${Math.random().toString(36).substr(2, 9)}`,
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.body,
        status: 'sent',
        service: 'mock',
        timestamp: new Date().toISOString(),
      };

      console.log('📧 Mock Email Sent:', mockEmail);

      this.logEmail(mockEmail);

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 300));

      return mockEmail;
    } catch (error) {
      console.error('Email service error:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send feedback request emails after event ends
   */
  async sendFeedbackRequestEmails(event, recipients, integrations) {
    const results = [];

    for (const recipient of recipients) {
      try {
        const emailData = {
          to: recipient.email,
          subject: `We'd love your feedback on ${event.name}`,
          body: this.generateFeedbackEmailBody(event, recipient),
          eventId: event.id,
          eventName: event.name,
          feedbackType: recipient.type || 'venue',
          recipientName: recipient.name,
        };

        let result;

        // Use Zapier if connected
        if (integrations?.zapier?.connected && integrations?.zapier?.webhookUrl) {
          result = await this.sendEmailViaZapier(emailData, integrations.zapier.webhookUrl);
        }
        // Otherwise use Stripe if connected
        else if (integrations?.stripe?.connected) {
          emailData.stripeCustomerId = recipient.stripeCustomerId || null;
          result = await this.sendEmailViaStripe(emailData, integrations.stripe.apiKey);
        }
        // Otherwise send generic mock email
        else {
          result = await this.sendEmail(emailData);
        }

        results.push({
          recipient: recipient.email,
          status: 'success',
          response: result,
        });
      } catch (error) {
        results.push({
          recipient: recipient.email,
          status: 'failed',
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Generate feedback email body
   */
  generateFeedbackEmailBody(event, recipient) {
    const feedbackType = recipient.type || 'venue';
    const feedbackUrl = `${window.location.origin}/event-feedback/${event.id}?type=${feedbackType}`;

    let emailBody = `
Hi ${recipient.name},

Thank you for being part of ${event.name}!

We'd love to hear about your experience. Your feedback helps us improve future events and ensures we provide the best experience possible.

${feedbackType === 'venue' ? `
**Please rate the following aspects of the venue:**
- Location & Accessibility
- Cleanliness & Maintenance
- Amenities & Facilities
- Staff & Service
- Value for Price
` : `
**Please rate the following aspects of the service:**
- Quality of Work
- Timeliness & Delivery
- Professionalism
- Value for Price
`}

👉 **[Click here to share your feedback](${feedbackUrl})**

Your feedback is valuable and will take just 2 minutes to complete.

Thank you!

Best regards,
Event Management Team
    `.trim();

    return emailBody;
  }

  /**
   * Log email locally for tracking
   */
  logEmail(emailData) {
    const email = {
      ...emailData,
      loggedAt: new Date().toISOString(),
    };

    this.sentEmails.push(email);
    localStorage.setItem('sentEmails', JSON.stringify(this.sentEmails));
  }

  /**
   * Get all sent emails
   */
  getSentEmails() {
    return this.sentEmails;
  }

  /**
   * Get emails for a specific event
   */
  getSentEmailsForEvent(eventId) {
    return this.sentEmails.filter((email) => email.eventId === eventId);
  }

  /**
   * Clear email logs
   */
  clearEmailLogs() {
    this.sentEmails = [];
    localStorage.removeItem('sentEmails');
  }

  /**
   * Set integrations
   */
  setIntegrations(integrations) {
    this.zapierIntegration = integrations?.zapier;
    this.stripeIntegration = integrations?.stripe;
  }
}

export default new EmailService();
