import React, { useState, useEffect, useRef } from 'react';
import { message as antMessage } from 'antd';
import dayjs from 'dayjs';
import { useDifyChat } from './hooks/useDifyChat';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatMessageList } from './components/ChatMessageList';
import { ChatWelcome } from './components/ChatWelcome';
import { ChatInput } from './components/ChatInput';
import { useAppStyles } from './styles/appStyles';
import { DifyService } from './services/difyService';
import { DIFY_CONFIG } from './config/dify.config';
import type { ConversationItem } from './types';

const DEFAULT_CONVERSATIONS: ConversationItem[] = [
  {
    key: 'default-0',
    label: 'New Conversation',
    group: 'Today',
  },
];

// single Dify instance
const difyService = new DifyService(DIFY_CONFIG.BASE_URL, DIFY_CONFIG.API_KEY);

const App: React.FC = () => {
  const { styles } = useAppStyles();

  const [conversations, setConversations] = useState<ConversationItem[]>(DEFAULT_CONVERSATIONS);
  const [currentConversation, setCurrentConversation] = useState<string>(DEFAULT_CONVERSATIONS[0].key);
  const [messageHistory, setMessageHistory] = useState<Record<string, any[]>>({});
  const [conversationDifyIds, setConversationDifyIds] = useState<Record<string, string>>({});
  const [renamedConversations, setRenamedConversations] = useState<Set<string>>(new Set());

  const conversationDifyIdsRef = useRef<Record<string, string>>({});

  const { messages, loading, sendMessage, abort, clearMessages, setMessages } = useDifyChat({
    onError: (error) => {
      antMessage.error(`Error: ${error.message}`);
    },
    difyService,
  });

  const isInitialMount = useRef(true);

  // ✅ Load existing Dify conversations when page loads
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await difyService.getConversations();
        const difyConvs = response?.data || [];

        const mapped: ConversationItem[] = difyConvs.map((conv: any) => ({
          key: conv.id,
          label: conv.name || 'Untitled',
          group: 'History',
          conversationId: conv.id,
        }));

        setConversations((prev) => [
          ...prev.filter((c) => c.key === 'default-0'),
          ...mapped,
        ]);

        const ids: Record<string, string> = {};
        difyConvs.forEach((c: any) => (ids[c.id] = c.id));
        setConversationDifyIds(ids);
        conversationDifyIdsRef.current = ids;
      } catch (error) {
        console.error('❌ Error loading conversation list:', error);
      }
    };

    loadConversations();
  }, []);

  // -------------------------------
  // Send message handler
  // -------------------------------
  const handleSendMessage = async (content: string) => {
    const difyConversationId = conversationDifyIdsRef.current[currentConversation];
    console.log('📤 Sending message with conversation ID:', difyConversationId);

    try {
      const newDifyId = await sendMessage(content, difyConversationId);

      if (newDifyId) {
        conversationDifyIdsRef.current[currentConversation] = newDifyId;
        setConversationDifyIds((prev) => ({ ...prev, [currentConversation]: newDifyId }));

        if (!difyConversationId && !renamedConversations.has(currentConversation)) {
          try {
            setTimeout(async () => {
              const title = await difyService.renameConversation(newDifyId);
              setConversations((prev) =>
                prev.map((conv) =>
                  conv.key === currentConversation
                    ? { ...conv, label: title, conversationId: newDifyId }
                    : conv
                )
              );
              setRenamedConversations((prev) => new Set([...prev, currentConversation]));
            }, 500);
          } catch (error) {
            const preview = content.slice(0, 50);
            setConversations((prev) =>
              prev.map((conv) =>
                conv.key === currentConversation
                  ? {
                      ...conv,
                      label: preview + (preview.length >= 50 ? '...' : ''),
                      conversationId: newDifyId,
                    }
                  : conv
              )
            );
          }
        }
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      antMessage.error('Failed to send message. Please try again.');
    }
  };

  // -------------------------------
  // New conversation
  // -------------------------------
  const handleNewConversation = () => {
    const now = dayjs().valueOf().toString();
    const newConversation: ConversationItem = {
      key: now,
      label: `Conversation ${conversations.length + 1}`,
      group: 'Today',
    };

    setConversations([newConversation, ...conversations]);
    setCurrentConversation(now);
    clearMessages();
  };

 // -------------------------------
// Click history conversation
// -------------------------------
const handleConversationChange = async (key: string) => {
  if (loading) abort();
  setCurrentConversation(key);

  // 🧠 If the conversation is new (not yet linked to a Dify ID)
  if (!conversationDifyIds[key]) {
    console.log('🆕 Local-only conversation, skipping API fetch.');
    clearMessages();
    return;
  }

  // ✅ If messages are already cached in memory
  if (messageHistory[key]) {
    setMessages(messageHistory[key]);
    return;
  }

  const difyConvId = conversationDifyIds[key] || key;
  if (!difyConvId) {
    clearMessages();
    return;
  }

  try {
    const response = await difyService.getMessages(difyConvId, difyService.userId);
    const fetchedMessages = Array.isArray(response) ? response : [];

    const formatted = fetchedMessages.flatMap((msg: any, index: number) => {
      const chatParts: any[] = [];

      if (msg.query) {
        chatParts.push({
          id: `${msg.id}-q-${index}`,
          message: { role: 'user', content: msg.query },
          status: 'success',
        });
      }

      if (msg.answer) {
        chatParts.push({
          id: `${msg.id}-a-${index}`,
          message: { role: 'assistant', content: msg.answer },
          status: 'success',
        });
      }

      return chatParts;
    });

    setMessages(formatted);
    setMessageHistory((prev) => ({ ...prev, [key]: formatted }));
  } catch (error) {
    console.error('❌ Error loading conversation messages:', error);
    antMessage.error('Failed to load chat history');
  }
};

  // -------------------------------
  // Delete conversation
  // -------------------------------
  const handleDeleteConversation = async (key: string) => {
    if (conversations.length <= 1) {
      antMessage.warning('Cannot delete the last conversation');
      return;
    }

    try {
      const difyConvId = conversationDifyIds[key] || key;
      if (difyConvId) await difyService.deleteConversation(difyConvId);

      const newConversations = conversations.filter((conv) => conv.key !== key);
      setConversations(newConversations);

      const newMessageHistory = { ...messageHistory };
      delete newMessageHistory[key];
      setMessageHistory(newMessageHistory);

      const newDifyIds = { ...conversationDifyIds };
      delete newDifyIds[key];
      setConversationDifyIds(newDifyIds);

      setRenamedConversations((prev) => {
        const updated = new Set(prev);
        updated.delete(key);
        return updated;
      });

      if (key === currentConversation) {
        const newKey = newConversations[0]?.key;
        setCurrentConversation(newKey);
        setMessages(messageHistory[newKey] || []);
      }

      antMessage.success('Conversation deleted');
    } catch (error) {
      console.error('❌ Error deleting conversation:', error);
      antMessage.error('Failed to delete conversation');
    }
  };

  // Save messages to history
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (messages.length > 0) {
      setMessageHistory((prev) => ({ ...prev, [currentConversation]: messages }));
    }
  }, [messages, currentConversation]);

  return (
    <div className={styles.layout}>
      <ChatSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        isLoading={loading}
        onConversationChange={handleConversationChange}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        styles={{
          sider: styles.sider,
          logo: styles.logo,
          addBtn: styles.addBtn,
          conversations: styles.conversations,
          siderFooter: styles.siderFooter,
        }}
      />

      <div className={styles.chat}>
        {messages.length > 0 ? (
          <ChatMessageList
            messages={messages}
            styles={{
              chatList: styles.chatList,
              loadingMessage: styles.loadingMessage,
            }}
          />
        ) : (
          <ChatWelcome
            onPromptClick={handleSendMessage}
            styles={{
              placeholder: styles.placeholder,
              chatPrompt: styles.chatPrompt,
            }}
          />
        )}

        <ChatInput
          loading={loading}
          onSendMessage={handleSendMessage}
          onCancel={abort}
          styles={{
            sender: styles.sender,
            speechButton: styles.speechButton,
            senderPrompt: styles.senderPrompt,
            ChatInput: styles.ChatInput,
          }}
        />
      </div>
    </div>
  );
};

export default App;
