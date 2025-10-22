import { ENDPOINTS } from '../endpoints';

/**
 * Contact service
 */
class ContactService {
  /**
   * Send contact message
   * @param {object} messageData - Message data
   * @returns {Promise<object>} - Response
   */
  async sendMessage(messageData) {
    const response = await fetch(ENDPOINTS.CONTACT.SEND_MESSAGE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return await response.json();
  }

  /**
   * Get contact messages (admin only)
   * @param {object} params - Query parameters
   * @returns {Promise<object>} - Messages list
   */
  async getMessages(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${ENDPOINTS.CONTACT.GET_MESSAGES}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return await response.json();
  }
}

export const contactService = new ContactService();
