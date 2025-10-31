# 🚀 Quick Setup Guide

## Step-by-Step Instructions

### 1. Get Your Dify API Key

Before you start, you need a Dify API key:

1. Go to [Dify.ai](https://dify.ai) and sign in
2. Create a new application or select an existing one
3. Navigate to the **"API Access"** section in your app
4. Click **"API Key"** and copy your key
5. It should look like: `app-xxxxxxxxxxxxxxxxxxxxxxxx`

### 2. Install Dependencies

```bash
cd dify-chatbot
npm install
```

**Alternative package managers:**
```bash
# Using Yarn
yarn install

# Using PNPM
pnpm install
```

### 3. Configure Your API Key

Open `src/config/dify.config.ts` and replace the placeholder:

```typescript
export const DIFY_CONFIG = {
  BASE_URL: 'https://api.dify.ai/v1',
  API_KEY: 'app-YOUR_ACTUAL_API_KEY_HERE', // 👈 Paste your key here!
  USER_PREFIX: 'user-',
};
```

### 4. Start Development Server

```bash
npm run dev
```

The app will automatically open at `http://localhost:3000`

### 5. Test the Chatbot

1. Type a message in the input box
2. Press Enter or click the Send button
3. Watch the AI response stream in real-time!

## 🎯 Understanding the Code

### Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main application component |
| `src/config/dify.config.ts` | API configuration (⚠️ Add your key here) |
| `src/hooks/useDifyChat.ts` | Custom hook for Dify integration |
| `src/services/difyService.ts` | Dify API client with streaming |
| `src/components/` | Reusable UI components |

### How Conversation History Works

The app maintains conversation history both **locally** and with **Dify**:

```typescript
// Local state (in browser)
messageHistory[conversationKey] = [...messages]

// Dify state (on server)
conversationDifyIds[conversationKey] = "conv-abc123"
```

When you send a message:
1. **First message**: No `conversation_id` is sent → Dify creates new conversation
2. **Subsequent messages**: `conversation_id` is sent → Dify maintains context

### Streaming Implementation

The streaming works through Server-Sent Events (SSE):

```typescript
// Dify sends chunks like this:
data: {"event":"message","answer":"Hello"}
data: {"event":"message","answer":" there!"}
data: {"event":"message_end","conversation_id":"conv-123"}

// Our service parses and updates the UI in real-time
```

## 🔧 Common Issues

### Issue: "Failed to fetch" or CORS error

**Solution**: Check your API key and ensure your Dify app allows API access.

### Issue: Messages not streaming

**Solution**: Verify that `response_mode: 'streaming'` is set in the API request (already configured).

### Issue: Conversation history not maintained

**Solution**: The app automatically stores `conversation_id` from Dify. Make sure you're not reloading the page (state is not persisted yet).

## 🎨 Customization Ideas

### Change the App Title

Edit `src/components/ChatSidebar.tsx`:
```typescript
<span>Your Custom Title</span>
```

### Modify Welcome Message

Edit `src/components/ChatWelcome.tsx`:
```typescript
<Welcome
  title="Your Custom Title"
  description="Your custom description"
  ...
/>
```

### Add New Prompt Suggestions

Edit the prompts in `src/components/ChatWelcome.tsx`:
```typescript
const HOT_TOPICS = {
  key: '1',
  label: 'Quick Start',
  children: [
    {
      key: '1-1',
      description: 'Your custom prompt here',
      icon: <span>1</span>,
    },
    // Add more...
  ],
};
```

### Change Theme Colors

The app uses Ant Design's theme tokens. To customize, wrap your app with ConfigProvider:

```typescript
import { ConfigProvider } from 'antd';

<ConfigProvider theme={{ token: { colorPrimary: '#00b96b' } }}>
  <App />
</ConfigProvider>
```

## 📦 Building for Production

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` directory.

## 🚀 Deployment

You can deploy this app to any static hosting service:

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### GitHub Pages
1. Update `vite.config.ts` with your base path
2. Run `npm run build`
3. Deploy the `dist/` folder

## 💡 Best Practices

1. **Never commit your API key** - Add `dify.config.ts` to `.gitignore` if sharing code
2. **Use environment variables** for production deployments
3. **Add error boundaries** for better error handling
4. **Implement retry logic** for failed API calls
5. **Add loading states** for better UX

## 📚 Learn More

- [Ant Design X Playground](https://x.ant.design/docs/playground/independent)
- [Dify API Documentation](https://docs.dify.ai/guides/application-publishing/developing-with-apis)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## 🤝 Need Help?

Common questions:

**Q: Can I use a different AI provider?**  
A: Yes! You'll need to modify `src/services/difyService.ts` to work with your provider's API.

**Q: How do I persist conversations across page refreshes?**  
A: Implement localStorage or a backend database to save `messageHistory` and `conversationDifyIds`.

**Q: Can I add authentication?**  
A: Yes! You can add authentication to protect your API key and associate conversations with users.

---

Happy coding! 🎉
