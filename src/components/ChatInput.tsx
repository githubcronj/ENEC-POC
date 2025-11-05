import React, { useState } from 'react';
import { Sender } from '@ant-design/x';
import { Flex } from 'antd';

interface ChatInputProps {
  loading: boolean;
  onSendMessage: (message: string) => void;
  onCancel: () => void;
  styles: {
    sender: string;
    speechButton: string;
    senderPrompt: string;
    ChatInput: string;
  };
}

export const ChatInput: React.FC<ChatInputProps> = ({
  loading,
  onSendMessage,
  onCancel,
  styles,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className={styles.ChatInput}>
      {/* Message input */}
      <Sender
        value={inputValue}
        onSubmit={handleSubmit}
        onChange={setInputValue}
        onCancel={onCancel}
        loading={loading}
        className={styles.sender}
        allowSpeech
        actions={(_, info) => {
          const { SendButton, LoadingButton, SpeechButton } = info.components;
          return (
            <Flex gap={4}>
              <SpeechButton className={styles.speechButton} />
              {loading ? (
                <LoadingButton type="default" />
              ) : (
                <SendButton type="primary" />
              )}
            </Flex>
          );
        }}
        placeholder="Type your message here..."
      />
    </div>
  );
};