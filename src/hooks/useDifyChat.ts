import { useState, useRef, useCallback } from 'react';
import type { ChatMessage, DifyStreamResponse } from '../types';
import { DifyService } from '../services/difyService';
import { DIFY_CONFIG } from '../config/dify.config';

interface UseDifyChatOptions {
  onError?: (error: Error) => void;
  difyService?: DifyService;
}

interface UseDifyChatReturn {
  messages: ChatMessage[];
  loading: boolean;
  sendMessage: (content: string, conversationId?: string) => Promise<string | undefined>;
  abort: () => void;
  clearMessages: () => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const useDifyChat = (options?: UseDifyChatOptions): UseDifyChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  // Use the passed difyService instance, or create a fallback
  const difyServiceRef = useRef<DifyService>(
    options?.difyService || new DifyService(DIFY_CONFIG.BASE_URL, DIFY_CONFIG.API_KEY)
  );
  const currentResponseRef = useRef<string>('');
  const currentMessageIdRef = useRef<string>('');

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string, conversationId?: string): Promise<string | undefined> => {
      if (loading) {
        console.warn('Already processing a message');
        return;
      }

      // Create user message
      const userMessageId = `user-${Date.now()}`;
      const userMessage: ChatMessage = {
        id: userMessageId,
        message: {
          role: 'user',
          content,
        },
        status: 'success',
      };

      // Create assistant placeholder message
      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        message: {
          role: 'assistant',
          content: '',
        },
        status: 'loading',
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setLoading(true);

      currentResponseRef.current = '';
      currentMessageIdRef.current = assistantMessageId;
      
      // Store workflow nodes for the current message (regular variable, not a hook)
      const workflowNodes: Array<{
        id: string;
        title: string;
        status: 'pending' | 'success' | 'error' | 'running';
        elapsed_time?: number;
        inputs?: Record<string, any>;
        outputs?: Record<string, any>;
        error?: string;
      }> = [];

      // Create abort controller
      abortControllerRef.current = new AbortController();

      let finalConversationId: string | undefined = conversationId;

      try {
        return await new Promise((resolve, reject) => {
          difyServiceRef.current.sendChatMessage(
            content,
            conversationId,
            (chunk: DifyStreamResponse) => {
              // Handle workflow events
              if (chunk.event === 'node_started') {
                const nodeData = (chunk as any).data;
                workflowNodes.push({
                  id: nodeData.id,
                  title: nodeData.title,
                  status: 'running',
                  inputs: nodeData.inputs,
                });
                
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === currentMessageIdRef.current
                      ? {
                          ...msg,
                          workflowNodes: [...workflowNodes],
                        }
                      : msg
                  )
                );
              }

              if (chunk.event === 'node_finished') {
                const nodeData = (chunk as any).data;
                const nodeIndex = workflowNodes.findIndex((n) => n.id === nodeData.id);
                if (nodeIndex !== -1) {
                  workflowNodes[nodeIndex] = {
                    ...workflowNodes[nodeIndex],
                    status: nodeData.status === 'succeeded' ? 'success' : nodeData.status === 'failed' ? 'error' : 'pending',
                    elapsed_time: nodeData.elapsed_time,
                    outputs: nodeData.outputs,
                    error: nodeData.error,
                  };
                }
                
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === currentMessageIdRef.current
                      ? {
                          ...msg,
                          workflowNodes: [...workflowNodes],
                        }
                      : msg
                  )
                );
              }

              // Handle streaming chunks
              if (chunk.event === 'agent_message' || chunk.event === 'message') {
                if (chunk.answer) {
                  currentResponseRef.current += chunk.answer;
                  
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === currentMessageIdRef.current
                        ? {
                            ...msg,
                            message: {
                              ...msg.message,
                              content: currentResponseRef.current,
                            },
                          }
                        : msg
                    )
                  );
                }
              }

              // Store conversation_id from any chunk that contains it
              if (chunk.conversation_id) {
                finalConversationId = chunk.conversation_id;
              }
            },
            (newConversationId: string) => {
              // On complete
              finalConversationId = newConversationId;
              
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === currentMessageIdRef.current
                    ? {
                        ...msg,
                        status: 'success',
                      }
                    : msg
                )
              );
              setLoading(false);
              resolve(finalConversationId);
            },
            (error: Error) => {
              // On error
              console.error('Dify chat error:', error);
              
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === currentMessageIdRef.current
                    ? {
                        ...msg,
                        message: {
                          ...msg.message,
                          content: msg.message.content || 'An error occurred. Please try again.',
                        },
                        status: 'error',
                      }
                    : msg
                )
              );
              setLoading(false);
              
              if (options?.onError) {
                options.onError(error);
              }
              
              reject(error);
            },
            abortControllerRef.current?.signal
          );
        });
      } catch (error) {
        console.error('Error in sendMessage:', error);
        setLoading(false);
        throw error;
      }
    },
    [loading, options]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    currentResponseRef.current = '';
  }, []);

  return {
    messages,
    loading,
    sendMessage,
    abort,
    clearMessages,
    setMessages,
  };
};