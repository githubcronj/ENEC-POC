import { createStyles } from 'antd-style';

export const useAppStyles = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      min-width: 1000px;
      height: 100vh;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: ${token.fontFamily}, sans-serif;
    `,
    
    // Sidebar styles
    sider: css`
      background: ${token.colorBgLayout}80;
      width: 280px;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 12px;
      box-sizing: border-box;
    `,
    
    logo: css`
      display: flex;
      align-items: center;
      justify-content: start;
      padding: 0 24px;
      box-sizing: border-box;
      gap: 8px;
      margin: 24px 0;

      span {
        font-weight: bold;
        color: ${token.colorText};
        font-size: 16px;
      }
    `,
    
    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      height: 40px;
    `,
    
    conversations: css`
      flex: 1;
      overflow-y: auto;
      margin-top: 12px;
      padding: 0;

      .ant-conversations-list {
        padding-inline-start: 0;
      }
    `,
    
    siderFooter: css`
      border-top: 1px solid ${token.colorBorderSecondary};
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,

    chatTitle: css`
      .ant-welcome-icon {
        height: auto;
        display: flex;
      }
      h4 {
        font-size: 30px !important;
      }
    `,
    
    // Chat area styles
    chat: css`
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding-block: ${token.paddingLG}px;
      gap: 16px;
      justify-content: center;
    `,
    
    chatPrompt: css`
      .ant-prompts-label {
        color: #000000e0 !important;
      }
      .ant-prompts-desc {
        color: #000000a6 !important;
        width: 100%;
      }
      .ant-prompts-icon {
        color: #000000a6 !important;
      }
      .ant-prompts-list {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 12px !important;
      }
    `,
    
    chatList: css`
      height: 88%;
      flex: 1;
      overflow: auto;
    `,
    
    ChatInput: css`
      height: 12%;
    `,
    
    loadingMessage: css`
      background-image: linear-gradient(
        90deg,
        #ff6b23 0%,
        #af3cb8 31%,
        #53b6ff 89%
      );
      background-size: 100% 2px;
      background-repeat: no-repeat;
      background-position: bottom;
    `,
    
    placeholder: css`
      padding-top: 0;
    `,
    
    welcomeContainer: css`
      padding-inline: calc(calc(100% - 700px) / 2);
      gap: 32px;
    `,
    
    welcomeContent: css`
      padding-bottom: 15px;
      display: flex;
      align-items: center;
    `,
    
    welcomeLogo: css`
      width: 24px;
      height: 24px;
      object-fit: cover;
    `,
    
    welcomeTitle: css`
      margin: 0;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
    `,
    
    promptsContainer: css`
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
    `,
    
    // Input area styles
    sender: css`
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      padding: 12px 8px;
      box-sizing: border-box;

      background: ${token.colorBgContainer};
      z-index: 10;
      
      .ant-sender-content {
        padding-block: 0;
        padding-inline-start: 0;
        padding-inline-end: 0;
      }
    `,
    
    speechButton: css`
      font-size: 18px;
      color: ${token.colorText} !important;
    `,
    
    senderPrompt: css`
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      color: ${token.colorText};

      .ant-prompts-list {
        justify-content: center;
        margin-bottom: 17px;
      }
    `,
  };
});

export const PROMPTS_STYLES = {
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
};