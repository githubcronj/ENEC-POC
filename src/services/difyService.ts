// src/services/DifyService.ts
import type { DifyChatRequest, DifyStreamResponse } from '../types';

export interface ConversationDetail {
  id: string;
  name: string;
  inputs: Record<string, any>;
  status: string;
  introduction: string;
  created_at: number;
  updated_at: number;
}

export interface ConversationsResponse {
  data: ConversationDetail[];
  has_more: boolean;
  limit: number;
}

export class DifyService {
  private baseURL: string;
  private apiKey: string;
  public userId: string;
  baseUrl: any;

  constructor(baseURL: string = 'https://api.dify.ai/v1', apiKey: string) {
  this.baseURL = baseURL;
  this.apiKey = apiKey;

  // ✅ Persist user ID across refreshes
  const storedUserId = localStorage.getItem('user_id');
  if (storedUserId) {
    this.userId = storedUserId;
  } else {
    this.userId = 'user-' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('user_id', this.userId);
  }
}

  /**
   * Send a chat message to Dify with streaming support
   */
  async sendChatMessage(
    query: string,
    conversationId: string | undefined,
    onStream: (chunk: DifyStreamResponse) => void,
    onComplete: (conversationId: string) => void,
    onError: (error: Error) => void,
    abortSignal?: AbortSignal,
  ): Promise<void> {
    const requestBody: DifyChatRequest = {
      inputs: {},
      query,
      response_mode: 'streaming',
      conversation_id: conversationId || '',
      user: this.userId,
    };

    try {
      const response = await fetch(`${this.baseURL}/chat-messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: abortSignal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Dify API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorBody,
        });
        throw new Error(`HTTP error! status: ${response.status} - ${errorBody || response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is not readable');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let lastConversationId = conversationId;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6).trim();
              if (jsonStr) {
                const data: DifyStreamResponse = JSON.parse(jsonStr);
                if (data.conversation_id) lastConversationId = data.conversation_id;
                onStream(data);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e, line);
            }
          }
        }
      }

      if (lastConversationId) onComplete(lastConversationId);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') console.log('Request aborted');
        else onError(error);
      } else {
        onError(new Error('Unknown error occurred'));
      }
    }
  }

   async getConversations(limit: number = 20, lastId?: string, sortBy = '-updated_at'): Promise<ConversationsResponse> {
    const params = new URLSearchParams({
      user: this.userId,
      limit: limit.toString(),
      sort_by: sortBy,
    });
    if (lastId) params.append('last_id', lastId);

    const response = await fetch(`${this.baseURL}/conversations?${params}`, {
      headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }
  // ------------------------------
// Get conversation message history
// ------------------------------
  async getMessages(conversationId: string, userId: string, limit = 20) {
    try {
      const url = `${this.baseURL}/messages?user=${userId}&conversation_id=${conversationId}&limit=${limit}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const result = await response.json();

      // ✅ Return only the array
      return Array.isArray(result?.data) ? result.data : [];
    } catch (error) {
      console.error('❌ Error fetching conversation messages:', error);
      return [];
    }
  }

  async renameConversation(conversationId: string): Promise<string> {
    const response = await fetch(`${this.baseURL}/conversations/${conversationId}/name`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ auto_generate: true, user: this.userId }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.name || 'Conversation';
  }

  async deleteConversation(conversationId: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: this.userId }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    console.log('Conversation deleted');
  }
}
