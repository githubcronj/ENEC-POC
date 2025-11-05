// src/components/ChatSidebar.tsx
import React, { useMemo } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Conversations } from '@ant-design/x';
import { Button, message } from 'antd';
import type { ConversationItem } from '../types';
import logo from '../assets/enec-logo.png';

interface ChatSidebarProps {
  conversations: ConversationItem[];
  currentConversation: string;
  isLoading: boolean;
  onConversationChange: (key: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (key: string) => void;
  messageHistory: Record<string, any[]>;
  conversationDifyIds: Record<string, string>;
  styles: {
    sider: string;
    logo: string;
    addBtn: string;
    conversations: string;
    siderFooter: string;
  };
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  currentConversation,
  isLoading,
  onConversationChange,
  onNewConversation,
  onDeleteConversation,
  conversationDifyIds,
  styles,
}) => {
  const handleNewConversation = () => {
    if (isLoading) {
      message.error('Message is processing. Please wait or cancel the current request.');
      return;
    }
    onNewConversation();
  };

  const handleDeleteConversation = (key: string) => {
    if (conversations.length <= 1) {
      message.warning('Cannot delete the last conversation.');
      return;
    }
    onDeleteConversation(key);
  };

  // ------------------------------
  // NEW: disable new conversation if ANY conversation is still "empty"
  // A conversation is considered "empty/new" when it does NOT have a Dify conversation id
  // (i.e., hasn't hit the backend yet).
  // ------------------------------
  const hasEmptyConversation = useMemo(
    () => conversations.some((c) => !conversationDifyIds?.[c.key]),
    [conversations, conversationDifyIds]
  );

  // disable "New Conversation" while a conversation exists that's not yet synced to Dify
  const disableNewConversation = hasEmptyConversation;

  return (
    <div className={styles.sider}>
      {/* Logo */}
      <div className={styles.logo}>
        <img src={logo} alt="logo" width={24} height={24} draggable={false} />
        <span>ENEC Chat</span>
      </div>

      {/* New Conversation */}
      <Button
        onClick={handleNewConversation}
        type="link"
        className={styles.addBtn}
        icon={<PlusOutlined />}
        disabled={disableNewConversation}
      >
        New Conversation
      </Button>

      {/* Conversations List */}
      <Conversations
        items={conversations}
        className={styles.conversations}
        activeKey={currentConversation}
        onActiveChange={onConversationChange}
        groupable
        styles={{ item: { padding: '0 8px' } }}
        menu={(conversation) => {
          // Disable rename/delete when conversation has no Dify id
          const hasDifyId = Boolean(conversationDifyIds?.[conversation.key]);

          return {
            items: [
              {
                label: 'Rename',
                key: 'rename',
                icon: <EditOutlined />,
                disabled: !hasDifyId,
                onClick: () => message.info('Rename feature coming soon!'),
              },
              {
                label: 'Delete',
                key: 'delete',
                icon: <DeleteOutlined />,
                danger: true,
                disabled: !hasDifyId,
                onClick: () => handleDeleteConversation(conversation.key),
              },
            ],
          };
        }}
      />
    </div>
  );
};