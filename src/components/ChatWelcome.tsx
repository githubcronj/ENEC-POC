import React from 'react';
import { Prompts, Welcome } from '@ant-design/x';
import { Flex } from 'antd';
import logo from '../assets/enec-logo.png';
import {
  SafetyOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { Typewriter } from 'react-simple-typewriter';

interface ChatWelcomeProps {
  onPromptClick: (text: string) => void;
  styles: {
    chatTitle: string | undefined;
    placeholder: string;
    chatPrompt: string;
  };
}

const HOT_TOPICS = [
  {
    key: '1',
    icon: <SafetyOutlined style={{ color: '#FF6B35' }} />,
    label: 'Safety & Security',
    description: 'What are ENEC safety and security requirements?',
  },
  {
    key: '2',
    icon: <TeamOutlined style={{ color: '#004E89' }} />,
    label: 'Career & Development',
    description: 'Tell me about Emiratization and career opportunities',
  },
  {
    key: '3',
    icon: <CheckCircleOutlined style={{ color: '#7209B7' }} />,
    label: 'Policies & Compliance',
    description: 'What are ENEC governance and compliance policies?',
  },
  {
    key: '4',
    icon: <LeftOutlined style={{ color: '#06A77D' }} />,
    label: 'Sustainability',
    description: 'How is ENEC committed to clean nuclear energy?',
  },
];

export const ChatWelcome: React.FC<ChatWelcomeProps> = ({
  styles,
}) => {
  return (
    <Flex

      align="center"
      justify="center"
      style={{
        paddingInline: 'calc(calc(100% - 700px) / 2)',
        gap: '32px',
      }}
      className={styles.placeholder}
    >
      {/* Welcome Message - Top/Center */}
      <Welcome
        variant="borderless"
        className={styles.chatTitle}
        style={{ paddingBottom: '15px', display: 'flex', alignItems: 'center' }}
        icon={
          <img
            src={logo}
            alt="logo"
            style={{
              width: '24px',
              height: '24px',
              objectFit: 'cover',
            }}
          />
        }
        title={
          <Title
            level={2}
            style={{
              margin: 0,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Typewriter
              words={['Hello Nisarg, how can I help you today?']}
              loop={false}
              cursor
              cursorStyle="|"
              typeSpeed={50}
              deleteSpeed={30}
              delaySpeed={1000}
            />
          </Title>
        }
      />
    </Flex>
  );
};

// 🆕 New Separate Component for Prompts
export const ChatPrompts: React.FC<{
  onPromptClick: (text: string) => void;
  className: string;
}> = ({ onPromptClick, className }) => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '700px',
        margin: '0 auto',
      }}
    >
      <Prompts
        items={HOT_TOPICS}
        styles={{
          list: { height: 'auto' },
          item: {
            flex: 1,
            backgroundImage:
              'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
            borderRadius: 4,
            border: 'none',
            padding: '10px',
            width: 'auto',
          },
        }}
        onItemClick={(info) => {
          onPromptClick(info.data.description as string);
        }}
        className={className}
      />
    </div>
  );
};
