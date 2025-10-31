import React from 'react';
import {
  CopyOutlined,
  DislikeOutlined,
  LikeOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { BubbleProps } from '@ant-design/x';
import { Button, Spin, message as antMessage, Typography } from 'antd';
import markdownit from 'markdown-it';
import { ThoughtChainDisplay } from './ThoughtChainDisplay';
import type { ChatMessage } from '../types';

const md = markdownit({ 
  html: true, 
  breaks: true,
  linkify: true,
});

interface ChatMessageListProps {
  messages: ChatMessage[];
  styles: {
    chatList: string;
    loadingMessage: string;
  };
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  styles,
}) => {
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    antMessage.success('Copied to clipboard');
  };

  const handleRegenerate = () => {
    antMessage.info('Regenerate feature coming soon!');
  };

  const handleLike = () => {
    antMessage.success('Thanks for your feedback!');
  };

  const handleDislike = () => {
    antMessage.info('Thanks for your feedback!');
  };

  // Markdown render function for assistant messages
  const renderMarkdown: BubbleProps['messageRender'] = (content) => {
    return (
      <Typography>
        <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
      </Typography>
    );
  };

  // Custom content render to include thought chain
  const renderContent = (msg: ChatMessage) => {
    if (msg.message.role === 'assistant') {
      return (
        <div>
          {msg.workflowNodes && msg.workflowNodes.length > 0 && (
            <ThoughtChainDisplay nodes={msg.workflowNodes} />
          )}
          <div>{renderMarkdown(msg.message.content)}</div>
        </div>
      );
    }
    return msg.message.content;
  };

  return (
    <div className={styles.chatList}>
      <Bubble.List
        items={messages.map((msg) => ({
          key: msg.id,
          role: msg.message.role,
          content: renderContent(msg),
          classNames: {
            content: msg.status === 'loading' ? styles.loadingMessage : '',
          },
          typing: msg.status === 'loading' ? { step: 5, interval: 20 } : false,
        }))}
        style={{ 
          height: '100%', 
          paddingInline: 'calc(calc(100% - 700px) / 2)' 
        }}
        roles={{
          assistant: {
            placement: 'start',
            footer: (content) => {
              // Find the message
              const msg = messages.find(m => m.message.content === content);
              
              // Only show footer for assistant messages that are not loading
              if (msg?.message.role !== 'assistant' || msg?.status === 'loading') {
                return null;
              }

              return (
                <div style={{ display: 'flex' }}>
                  <Button
                    type="text"
                    size="small"
                    icon={<ReloadOutlined />}
                    onClick={handleRegenerate}
                  />
                  <Button
                    type="text"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => handleCopy(content)}
                  />
                  <Button
                    type="text"
                    size="small"
                    icon={<LikeOutlined />}
                    onClick={handleLike}
                  />
                  <Button
                    type="text"
                    size="small"
                    icon={<DislikeOutlined />}
                    onClick={handleDislike}
                  />
                </div>
              );
            },
            loadingRender: () => <Spin size="small" />,
          },
          user: { 
            placement: 'end' 
          },
        }}
      />
    </div>
  );
};