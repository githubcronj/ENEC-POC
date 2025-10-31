import React, { useState } from 'react';
import { PaperClipOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { Attachments, Prompts, Sender } from '@ant-design/x';
import { Button, Flex, type GetProp } from 'antd';

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

// const SENDER_PROMPTS: GetProp<typeof Prompts, 'items'> = [
//   {
//     key: '1',
//     description: 'How can I help you today?',
//   },
//   {
//     key: '2',
//     description: 'What would you like to know?',
//   },
//   {
//     key: '3',
//     description: 'Ask me anything',
//   },
// ];

export const ChatInput: React.FC<ChatInputProps> = ({
  loading,
  onSendMessage,
  onCancel,
  styles,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<
    GetProp<typeof Attachments, 'items'>
  >([]);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const senderHeader = (
    <Sender.Header
      title="Upload File"
      open={attachmentsOpen}
      onOpenChange={setAttachmentsOpen}
      styles={{ content: { padding: 0 } }}
    >
      <Attachments
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={(info) => setAttachedFiles(info.fileList)}
        placeholder={(type) =>
          type === 'drop'
            ? { title: 'Drop file here' }
            : {
                icon: <CloudUploadOutlined />,
                title: 'Upload files',
                description: 'Click or drag files to this area to upload',
              }
        }
      />
    </Sender.Header>
  );

  return (
    <div className={styles.ChatInput}>
      {/* Prompt suggestions when input is empty */}

      {/* Message input */}
      <Sender
        value={inputValue}
        header={senderHeader}
        onSubmit={handleSubmit}
        onChange={setInputValue}
        onCancel={onCancel}
        prefix={
          <Button
            type="text"
            icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
            onClick={() => setAttachmentsOpen(!attachmentsOpen)}
          />
        }
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
