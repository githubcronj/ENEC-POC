# Dify Chatbot with Ant Design X

A modern, modular React TypeScript chatbot application that integrates **Ant Design X** with **Dify API** for AI-powered conversations with streaming support.

## ✨ Features

- 🎨 **Beautiful UI** - Built with Ant Design X for a modern chat interface
- 🔄 **Streaming Responses** - Real-time streaming from Dify API
- 💬 **Conversation Management** - Multiple conversations with history
- 📝 **TypeScript** - Fully typed for better development experience
- 🏗️ **Modular Architecture** - Well-organized component structure
- 🎯 **Context Aware** - Maintains conversation history across messages
- 🚀 **Fast Development** - Powered by Vite

## 📁 Project Structure

```
dify-chatbot/
├── src/
│   ├── components/          # React components
│   │   ├── ChatSidebar.tsx     # Conversation list sidebar
│   │   ├── ChatMessageList.tsx  # Message display
│   │   ├── ChatWelcome.tsx      # Welcome screen with prompts
│   │   └── ChatInput.tsx        # Message input component
│   ├── config/              # Configuration files
│   │   └── dify.config.ts      # Dify API configuration
│   ├── hooks/               # Custom React hooks
│   │   └── useDifyChat.ts      # Dify chat integration hook
│   ├── services/            # API services
│   │   └── difyService.ts      # Dify API client
│   ├── styles/              # Styling
│   │   └── appStyles.ts        # App-wide styles
│   ├── types/               # TypeScript types
│   │   └── index.ts            # Type definitions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm
- A Dify account with API access

### Installation

1. **Clone or download the project**

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Configure Dify API**

Edit `src/config/dify.config.ts` and add your Dify API key:

```typescript
export const DIFY_CONFIG = {
  BASE_URL: 'https://api.dify.ai/v1',
  API_KEY: 'app-YOUR_ACTUAL_API_KEY_HERE', // Replace this!
  USER_PREFIX: 'user-',
};
```

**How to get your Dify API Key:**
- Go to your [Dify dashboard](https://dify.ai)
- Navigate to your application
- Go to "API Access" section
- Copy your API Key

4. **Start the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will open at `http://localhost:3000`

## 🏗️ Architecture

### Key Components

#### 1. **useDifyChat Hook** (`src/hooks/useDifyChat.ts`)
Custom hook that handles all Dify API interactions:
- Message sending with streaming
- Conversation ID management
- Loading states
- Error handling
- Abort functionality

#### 2. **DifyService** (`src/services/difyService.ts`)
Service class for Dify API:
- Streaming chat messages
- Server-Sent Events (SSE) parsing
- Conversation management
- Error handling

#### 3. **Components**
- **ChatSidebar**: Manages conversation list and navigation
- **ChatMessageList**: Displays messages with typing effects
- **ChatWelcome**: Shows initial prompts and welcome message
- **ChatInput**: Handles user input and file attachments

### How Conversation Management Works

The app maintains conversation history in two ways:

1. **Local State**: 
   - `messageHistory`: Stores all messages for each conversation locally
   - `conversationDifyIds`: Maps local conversation IDs to Dify conversation IDs

2. **Dify Integration**:
   - On first message: Creates a new conversation and receives a `conversation_id`
   - On subsequent messages: Sends the `conversation_id` to maintain context
   - Dify automatically maintains the conversation history server-side

### Streaming Implementation

The streaming is implemented using Server-Sent Events (SSE):

```typescript
// Dify sends data in this format:
data: {"event":"message","answer":"Hello"}
data: {"event":"message","answer":" world"}
data: {"event":"message_end","conversation_id":"abc123"}
```

The `DifyService` parses these events and updates the UI in real-time.

## 🔧 Configuration Options

### Dify Configuration (`src/config/dify.config.ts`)

```typescript
export const DIFY_CONFIG = {
  BASE_URL: 'https://api.dify.ai/v1',  // Your Dify instance URL
  API_KEY: 'app-xxx',                   // Your API key
  USER_PREFIX: 'user-',                 // Prefix for user IDs
};
```

### Customizing Prompts

Edit the prompts in:
- `src/components/ChatWelcome.tsx` - Initial welcome prompts
- `src/components/ChatInput.tsx` - Input suggestion prompts

## 📝 Usage Examples

### Basic Usage

```typescript
// The app is ready to use out of the box!
// Just type a message and hit send
```

### Creating a New Conversation

```typescript
// Click the "New Conversation" button in the sidebar
// Each conversation maintains its own history and Dify conversation_id
```

### Switching Conversations

```typescript
// Click on any conversation in the sidebar
// The message history is automatically loaded
// The Dify conversation_id is maintained for context
```

## 🔍 API Integration Details

### Dify API Endpoint

```
POST https://api.dify.ai/v1/chat-messages
```

### Request Format

```typescript
{
  "inputs": {},
  "query": "Your message here",
  "response_mode": "streaming",
  "conversation_id": "optional-previous-conversation-id",
  "user": "user-identifier"
}
```

### Response Format (SSE)

```
data: {"event":"message","answer":"Response text"}
data: {"event":"message_end","conversation_id":"conv-123"}
```

## 🎨 Styling

The app uses `antd-style` for component styling with the following approach:

- CSS-in-JS with type safety
- Theme tokens from Ant Design
- Scoped styles per component
- Responsive design

## 🐛 Troubleshooting

### API Key Issues

If you get authentication errors:
1. Check that your API key in `src/config/dify.config.ts` is correct
2. Ensure it starts with `app-`
3. Verify the key is active in your Dify dashboard

### Streaming Not Working

If messages aren't streaming:
1. Check browser console for CORS errors
2. Verify your Dify app has streaming enabled
3. Check network tab to see if SSE connection is established

### TypeScript Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Ant Design X** - AI chatbot components
- **Ant Design** - UI component library
- **Vite** - Build tool and dev server
- **antd-style** - Styling solution
- **Dify API** - AI backend

## 🤝 Contributing

Contributions are welcome! Here are some ideas:

- Add file upload support
- Implement conversation search
- Add message export functionality
- Improve error handling
- Add unit tests

## 📄 License

This project is provided as-is for educational and commercial use.

## 🔗 Links

- [Ant Design X Documentation](https://x.ant.design/)
- [Dify Documentation](https://docs.dify.ai/)
- [Dify API Reference](https://docs.dify.ai/guides/application-publishing/developing-with-apis)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 💡 Tips

1. **Conversation IDs**: The app automatically manages Dify conversation IDs. Each local conversation gets mapped to a Dify conversation_id once the first message is sent.

2. **Error Handling**: Errors are displayed via Ant Design messages. Check the browser console for detailed error information.

3. **Performance**: The app uses React.StrictMode in development, which may cause double renders. This is normal and only affects development.

4. **Customization**: All components are modular and can be easily customized or replaced.

## 🎯 Next Steps

After getting the basic app running, consider:

1. Adding authentication
2. Implementing conversation persistence (localStorage/backend)
3. Adding more Dify features (file upload, suggestions, etc.)
4. Customizing the UI theme
5. Adding analytics

---

Built with ❤️ using React, TypeScript, Ant Design X, and Dify
