// Message types
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
}

// Dify API types
export interface DifyMessage {
  role: string;
  content: string;
}

export interface DifyStreamResponse {
  event: string;
  task_id?: string;
  id?: string;
  conversation_id?: string;
  message_id?: string;
  answer?: string;
  created_at?: number;
  metadata?: Record<string, any>;
}

export interface DifyChatRequest {
  inputs: Record<string, any>;
  query: string;
  response_mode: 'streaming' | 'blocking';
  conversation_id?: string;
  user: string;
  files?: Array<{
    type: string;
    transfer_method: string;
    url: string;
  }>;
}

// Conversation types
export interface ConversationItem {
  key: string;
  label: string;
  group: string;
  conversationId?: string; // Dify conversation ID
}

// Chat message with status
export interface ChatMessage {
  message: Message;
  status?: 'loading' | 'success' | 'error';
  id: string;
  workflowNodes?: Array<{
    id: string;
    title: string;
    status: 'pending' | 'success' | 'error' | 'running';
    elapsed_time?: number;
    inputs?: Record<string, any>;
    outputs?: Record<string, any>;
    error?: string;
  }>;
}

// Conversation History Types
export interface ConversationItem {
  id: string;
  name: string;
  inputs: Record<string, any>;
  status: string;
  introduction: string;
  created_at: number;
  updated_at: number;
}

export interface ConversationMessageItem {
  id: string;
  conversation_id: string;
  inputs: Record<string, any>;
  query: string;
  answer: string;
  message_files: Array<{
    id: string;
    type: string;
    url: string;
    belongs_to: string;
  }>;
  feedback: Record<string, any> | null;
  retriever_resources: Array<any>;
  created_at: number;
}

// Attachment types
export interface AttachmentFile {
  uid: string;
  name: string;
  status: string;
  url?: string;
}