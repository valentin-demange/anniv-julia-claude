interface ConversationEntry {
  timestamp: string;
  userMessage: string;
  botResponse: string;
}

export class GoogleDocsLogger {
  private webhookUrl: string;

  constructor() {
    // You'll create a Google Apps Script webhook URL
    this.webhookUrl = process.env.GOOGLE_APPS_SCRIPT_URL || '';
  }

  async logConversation(entry: ConversationEntry): Promise<void> {
    if (!this.webhookUrl) {
      console.warn('Google Apps Script URL not configured, logging to console instead');
      console.log('📝 Conversation log:', {
        timestamp: new Date(entry.timestamp).toLocaleString('fr-FR', {
          timeZone: 'Europe/Paris',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        user: entry.userMessage,
        bot: entry.botResponse
      });
      return;
    }

    try {
      const timestamp = new Date(entry.timestamp).toLocaleString('fr-FR', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp,
          userMessage: entry.userMessage,
          botResponse: entry.botResponse,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ Successfully logged conversation to Google Docs');
    } catch (error) {
      console.error('❌ Error logging to Google Docs:', error);
      // Fallback: log to console
      console.log('📝 Conversation log (fallback):', {
        timestamp: entry.timestamp,
        user: entry.userMessage,
        bot: entry.botResponse
      });
    }
  }
}

export const googleDocsLogger = new GoogleDocsLogger();