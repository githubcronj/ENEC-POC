import React from 'react';
import { Prompts, Welcome } from '@ant-design/x';
import { Flex } from 'antd';
import logo from '../assets/enec-logo.png';
import Title from 'antd/es/typography/Title';
import { Typewriter } from 'react-simple-typewriter';
import { HOT_TOPICS } from '../constants/constant';
import { PROMPTS_STYLES } from '../styles/appStyles';

interface ChatWelcomeProps {
  styles: {
    chatTitle: string | undefined;
    placeholder: string;
    chatPrompt: string;
    welcomeContainer: string;
    welcomeContent: string;
    welcomeLogo: string;
    welcomeTitle: string;
    promptsContainer: string;
  };
}

export const ChatWelcome: React.FC<ChatWelcomeProps> = ({
  styles,
}) => {
  return (
    <Flex
      align="center"
      justify="center"
      className={`${styles.placeholder} ${styles.welcomeContainer}`}
    >
      {/* Welcome Message - Top/Center */}
      <Welcome
        variant="borderless"
        className={`${styles.chatTitle} ${styles.welcomeContent}`}
        icon={
          <img
            src={logo}
            alt="logo"
            className={styles.welcomeLogo}
          />
        }
        title={
          <Title
            level={2}
            className={styles.welcomeTitle}
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
  containerClassName: string;
}> = ({ onPromptClick, className, containerClassName }) => {
  return (
    <div
      className={containerClassName}
    >
      <Prompts
        items={HOT_TOPICS}
        styles={PROMPTS_STYLES}
        onItemClick={(info) => {
          onPromptClick(info.data.description as string);
        }}
        className={className}
      />
    </div>
  );
};