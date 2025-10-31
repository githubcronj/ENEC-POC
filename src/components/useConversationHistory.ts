import { useState, useCallback, useEffect } from 'react';
import { DifyService, ConversationDetail, ConversationMessage } from '../services/difyService';

interface UseConversationHistoryOptions {
  difyService?: DifyService;
}

interface UseConversationHistoryReturn {
  conversations: ConversationDetail[];
  currentMessages: ConversationMessage[];
  loading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  fetchConversationMessages: (conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  renameConversation: (conversationId: string, newName?: string, autoGenerate?: boolean) => Promise<void>;
  clearError: () => void;
}

export const useConversationHistory = (
  options?: UseConversationHistoryOptions
): UseConversationHistoryReturn => {
  const [conversations, setConversations] = useState<ConversationDetail[]>([]);
  const [currentMessages, setCurrentMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const difyService = options?.difyService;

  // 🔹 Fetch all conversations for the current user
  const fetchConversations = useCallback(async () => {
    if (!difyService) {
      setError('DifyService not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await difyService.getConversations();
      setConversations(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch conversations';
      setError(errorMessage);
      console.error('❌ Error fetching conversations:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [difyService]);

  // 🔹 Fetch messages for a selected conversation
  const fetchConversationMessages = useCallback(
    async (conversationId: string) => {
      if (!difyService) {
        setError('DifyService not available');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await difyService.getConversationMessages(conversationId);
        setCurrentMessages(response.data.reverse());
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
        setError(errorMessage);
        console.error('❌ Error fetching messages:', errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [difyService]
  );

  // 🔹 Delete a conversation
  const deleteConversation = useCallback(
    async (conversationId: string) => {
      if (!difyService) {
        setError('DifyService not available');
        return;
      }

      try {
        await difyService.deleteConversation(conversationId);
        setConversations((prev) => prev.filter((c) => c.id !== conversationId));
        console.log('✅ Conversation deleted from list');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete conversation';
        setError(errorMessage);
        console.error('❌ Error deleting conversation:', errorMessage);
        throw err;
      }
    },
    [difyService]
  );

  // 🔹 Rename a conversation
  const renameConversation = useCallback(
    async (conversationId: string, newName?: string, autoGenerate?: boolean) => {
      if (!difyService) {
        setError('DifyService not available');
        return;
      }

      try {
        const result = await difyService.renameConversation(conversationId, newName, autoGenerate);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  name: result.name,
                }
              : c
          )
        );
        console.log('✅ Conversation title updated');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to rename conversation';
        setError(errorMessage);
        console.error('❌ Error renaming conversation:', errorMessage);
        throw err;
      }
    },
    [difyService]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ✅ Automatically fetch conversation history on page load
  useEffect(() => {
    if (difyService) {
      fetchConversations();
    }
  }, [difyService, fetchConversations]);

  return {
    conversations,
    currentMessages,
    loading,
    error,
    fetchConversations,
    fetchConversationMessages,
    deleteConversation,
    renameConversation,
    clearError,
  };
};
