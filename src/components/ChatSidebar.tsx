// src/components/ChatSidebar.tsx
import React from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Conversations } from '@ant-design/x';
import { Avatar, Button, message } from 'antd';
import type { ConversationItem } from '../types';
import logo from '../assets/enec-logo.png';

interface ChatSidebarProps {
  conversations: ConversationItem[];
  currentConversation: string;
  isLoading: boolean;
  onConversationChange: (key: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (key: string) => void;
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
        disabled={isLoading}
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
        menu={(conversation) => ({
          items: [
            {
              label: 'Rename',
              key: 'rename',
              icon: <EditOutlined />,
              onClick: () => message.info('Rename feature coming soon!'),
            },
            {
              label: 'Delete',
              key: 'delete',
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => handleDeleteConversation(conversation.key),
            },
          ],
        })}
      />

    </div>
  );
};
