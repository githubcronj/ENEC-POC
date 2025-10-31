# Architecture Overview

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  ChatSidebar │  │ ChatWelcome  │  │  ChatInput   │     │
│  │  (Convs)     │  │  (Prompts)   │  │  (Sender)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │          ChatMessageList (Messages)              │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ User Actions
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       App Component                          │
│                   (State Management)                         │
│                                                              │
│  State:                                                      │
│  • conversations[]      - List of conversations             │
│  • currentConversation  - Active conversation ID            │
│  • messageHistory{}     - All messages by conversation      │
│  • conversationDifyIds{} - Maps local ID to Dify ID        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Hook Usage
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    useDifyChat Hook                          │
│                                                              │
│  • messages[]          - Current conversation messages      │
│  • loading             - Request state                      │
│  • sendMessage()       - Send message to Dify              │
│  • abort()            - Cancel request                      │
│  • clearMessages()    - Clear current messages             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ API Calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     DifyService                              │
│                   (API Client)                               │
│                                                              │
│  • sendChatMessage()                                        │
│    - POST /chat-messages                                    │
│    - Handles SSE streaming                                  │
│    - Parses response chunks                                 │
│    - Manages conversation_id                                │
│                                                              │
│  • getConversationHistory()                                 │
│  • deleteConversation()                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/SSE
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Dify API Server                           │
│                https://api.dify.ai/v1                       │
│                                                              │
│  Endpoints:                                                  │
│  • POST /chat-messages    - Send message (streaming)        │
│  • GET  /conversations/:id - Get conversation               │
│  • DELETE /conversations/:id - Delete conversation          │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Sending a Message

```
User Input (ChatInput)
    ↓
App.handleSendMessage()
    ↓
useDifyChat.sendMessage(content, conversationId?)
    ↓
DifyService.sendChatMessage()
    ↓
[Streaming Response]
    ↓
onStream callback (for each chunk)
    ↓
Update UI with streaming text
    ↓
onComplete callback
    ↓
Store conversation_id for future messages
```

### 2. Managing Conversations

```
User clicks "New Conversation"
    ↓
App.handleNewConversation()
    ↓
Create new conversation object
    ↓
Add to conversations[]
    ↓
Set as currentConversation
    ↓
clearMessages()

---

User switches conversation
    ↓
App.handleConversationChange(key)
    ↓
Load messages from messageHistory[key]
    ↓
Update UI with conversation messages
```

### 3. Conversation ID Management

```
First Message:
  conversationId = undefined
      ↓
  Send to Dify without conversation_id
      ↓
  Dify creates new conversation
      ↓
  Returns conversation_id in response
      ↓
  Store in conversationDifyIds[localKey]

Subsequent Messages:
  Get conversationId from conversationDifyIds[currentConversation]
      ↓
  Send to Dify with conversation_id
      ↓
  Dify uses existing conversation context
      ↓
  Returns more messages with same conversation_id
```

## Component Responsibilities

### ChatSidebar
- Display list of conversations
- Handle conversation switching
- Create new conversations
- Delete conversations
- Show user avatar

### ChatMessageList
- Display all messages in conversation
- Show typing indicators for loading messages
- Render user and assistant messages differently
- Provide action buttons (copy, like, etc.)

### ChatWelcome
- Show welcome message for empty conversations
- Display prompt suggestions
- Handle prompt clicks

### ChatInput
- Capture user input
- Handle message submission
- Show loading state during requests
- Support file attachments (UI ready)
- Voice input support (via Ant Design X)

### useDifyChat Hook
- Manage message state
- Handle API requests via DifyService
- Process streaming responses
- Handle errors and loading states
- Support request cancellation

### DifyService
- Abstract Dify API communication
- Parse Server-Sent Events (SSE)
- Handle streaming chunks
- Manage conversation IDs
- Error handling

## State Management Strategy

The app uses React's built-in state management:

1. **Local Component State**: UI-specific state (input values, dropdowns, etc.)
2. **App-Level State**: Shared state (conversations, message history)
3. **Hook State**: API and request state (messages, loading)

### State Persistence

Currently, state is stored in memory and lost on page refresh. To persist:

1. **localStorage**: Store messageHistory and conversationDifyIds
2. **Backend**: Send to server for cross-device sync
3. **IndexedDB**: For larger datasets

## API Integration Details

### Request Format

```typescript
POST https://api.dify.ai/v1/chat-messages

Headers:
  Authorization: Bearer {API_KEY}
  Content-Type: application/json

Body:
{
  "inputs": {},
  "query": "User message text",
  "response_mode": "streaming",
  "conversation_id": "conv-xxx", // Optional, for context
  "user": "user-12345"
}
```

### Streaming Response Format (SSE)

```
data: {"event":"message","answer":"Hello"}

data: {"event":"message","answer":" world"}

data: {"event":"message_end","conversation_id":"conv-abc123"}
```

### Event Types

| Event | Description |
|-------|-------------|
| `message` | Contains partial response text in `answer` field |
| `agent_message` | Alternative message event |
| `message_end` | Signals completion, includes `conversation_id` |
| `error` | Contains error information |

## TypeScript Type System

```typescript
// Core message type
Message {
  role: 'user' | 'assistant'
  content: string
}

// Chat message with metadata
ChatMessage {
  message: Message
  status?: 'loading' | 'success' | 'error'
  id: string
}

// Conversation metadata
ConversationItem {
  key: string              // Local ID
  label: string            // Display name
  group: string            // Group label
  conversationId?: string  // Dify conversation ID
}
```

## Error Handling Strategy

1. **Network Errors**: Caught in DifyService, passed to onError callback
2. **Abort/Cancel**: Handled via AbortController
3. **API Errors**: Parsed from response, shown to user
4. **Validation Errors**: Prevented at UI level

## Performance Considerations

1. **Streaming**: Updates UI incrementally, no waiting for full response
2. **Virtualization**: Could add for long message lists
3. **Debouncing**: Could add for input/search operations
4. **Memoization**: React.memo on components if needed

## Security Considerations

⚠️ **Important**: Current implementation stores API key in client-side code

For production:
1. Move API key to backend
2. Implement authentication
3. Use backend proxy for Dify API calls
4. Add rate limiting
5. Validate and sanitize user inputs

## Future Enhancements

- [ ] Message persistence (localStorage/backend)
- [ ] File upload support
- [ ] Image generation
- [ ] Voice input/output
- [ ] Conversation search
- [ ] Export conversations
- [ ] Theme customization
- [ ] Multi-language support
- [ ] User authentication
- [ ] Backend integration
