import React from 'react';
import {
  HeartOutlined,
  SmileOutlined,
  CommentOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import { Prompts, Welcome } from '@ant-design/x';
import {  Flex, Space } from 'antd';
import logo from '../assets/enec-logo.png';

interface ChatWelcomeProps {
  onPromptClick: (text: string) => void;
  styles: {
    placeholder: string;
    chatPrompt: string;
  };
}

const HOT_TOPICS = {
  key: '1',
  label: 'Quick Start',
  children: [
    {
      key: '1-1',
      description: 'What can you help me with?',
      icon: <span style={{ color: '#f93a4a', fontWeight: 700 }}>1</span>,
    },
    {
      key: '1-2',
      description: 'Tell me about your capabilities',
      icon: <span style={{ color: '#ff6565', fontWeight: 700 }}>2</span>,
    },
    {
      key: '1-3',
      description: 'Help me get started',
      icon: <span style={{ color: '#ff8f1f', fontWeight: 700 }}>3</span>,
    },
    {
      key: '1-4',
      description: 'Show me some examples',
      icon: <span style={{ color: '#00000040', fontWeight: 700 }}>4</span>,
    },
  ],
};

const FEATURE_GUIDE = {
  key: '2',
  label: 'Features',
  children: [
    {
      key: '2-1',
      icon: <HeartOutlined />,
      label: 'Understanding',
      description: 'AI understands your needs and provides solutions',
    },
    {
      key: '2-2',
      icon: <SmileOutlined />,
      label: 'Friendly',
      description: 'Natural and engaging conversation',
    },
    {
      key: '2-3',
      icon: <CommentOutlined />,
      label: 'Responsive',
      description: 'Quick and helpful responses',
    },
    {
      key: '2-4',
      icon: <PaperClipOutlined />,
      label: 'Context-aware',
      description: 'Remembers conversation history',
    },
  ],
};

export const ChatWelcome: React.FC<ChatWelcomeProps> = ({
  onPromptClick,
  styles,
}) => {
  return (
    <Space
      direction="vertical"
      size={8}
      style={{ paddingInline: 'calc(calc(100% - 700px) / 2)'}}
      className={styles.placeholder}
    >
      <Welcome
        variant="borderless"
        style={{ paddingBottom: '15px'}}
        icon={<img src={logo} alt="logo" style={{ borderRadius: '8px', width: 'auto', height:'auto' , objectFit: 'cover' }} />}
        title="Hello, I'm your ENEC AI Assistant"
        description="Smart, responsive, and ready to help—ask me anything."
      />

      <Flex gap={12} style={{ width: '100%' }}>
        <Prompts
          items={[HOT_TOPICS]}
          styles={{
            list: { height: 'auto' },
            item: {
              flex: 1,
              backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
              borderRadius: 8,
              border: 'none',
              padding: '8px',
            },
            subItem: { padding: '4px', background: 'transparent', fontSize: '12px' },
          }}
          onItemClick={(info) => {
            onPromptClick(info.data.description as string);
          }}
          className={styles.chatPrompt}
        />

        <Prompts
          items={[FEATURE_GUIDE]}
          styles={{
            item: {
              flex: 1,
              backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
              borderRadius: 8,
              border: 'none',
              padding: '8px',
            },
            subItem: { background: '#ffffffa6', padding: '4px', fontSize: '12px' },
          }}
          onItemClick={(info) => {
            onPromptClick(info.data.description as string);
          }}
          className={styles.chatPrompt}
        />
      </Flex>
      {/* <Flex gap={16}>
            <Prompts
              items={[HOT_TOPICS]}
              styles={{
                list: { height: '100%' },
                item: {
                  flex: 1,
                  backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                  borderRadius: 12,
                  border: 'none',
                },
                subItem: { padding: 0, background: 'transparent' },
              }}
              onItemClick={(info) => {
                onPromptClick(info.data.description as string);
              }}
              className={styles.chatPrompt}
            />

            <Prompts
              items={[FEATURE_GUIDE]}
              styles={{
                item: {
                  flex: 1,
                  backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                  borderRadius: 12,
                  border: 'none',
                },
                subItem: { background: '#ffffffa6' },
              }}
              onItemClick={(info) => {
                onPromptClick(info.data.description as string);
              }}
              className={styles.chatPrompt}
            />
          </Flex> */}
    </Space>
  );
};