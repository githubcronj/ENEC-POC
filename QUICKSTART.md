# Quick Reference Guide

## 🎯 Project Structure at a Glance

```
dify-chatbot/
├── src/
│   ├── components/       # UI Components
│   │   ├── ChatSidebar.tsx
│   │   ├── ChatMessageList.tsx
│   │   ├── ChatWelcome.tsx
│   │   └── ChatInput.tsx
│   ├── hooks/           # Custom Hooks
│   │   └── useDifyChat.ts
│   ├── services/        # API Services
│   │   └── difyService.ts
│   ├── config/          # Configuration
│   │   └── dify.config.ts ⚠️ ADD YOUR API KEY HERE
│   ├── types/           # TypeScript Types
│   └── styles/          # Styling
├── package.json
├── README.md           # Full documentation
├── SETUP.md           # Setup instructions
└── ARCHITECTURE.md    # Technical details
```

## ⚡ Quick Start (3 Steps)

```bash
# 1. Install
npm install

# 2. Add your Dify API key to src/config/dify.config.ts
# Edit this file and replace 'app-YOUR_API_KEY_HERE'

# 3. Run
npm run dev
```

## 🔑 Important Files

| File | What to Do |
|------|------------|
| `src/config/dify.config.ts` | ⚠️ **REQUIRED**: Add your Dify API key |
| `src/App.tsx` | Main app logic and state management |
| `src/hooks/useDifyChat.ts` | Dify integration - modify for custom behavior |
| `src/services/difyService.ts` | API client - change endpoints here |

## 📝 Common Customizations

### Change App Name
**File**: `src/components/ChatSidebar.tsx`
```typescript
<span>Dify Chat</span> // Change this text
```

### Modify Welcome Message
**File**: `src/components/ChatWelcome.tsx`
```typescript
title="Hello, I'm your AI Assistant" // Change this
description="Powered by Dify..." // And this
```

### Add Custom Prompts
**File**: `src/components/ChatWelcome.tsx`
```typescript
const HOT_TOPICS = {
  children: [
    {
      key: '1-1',
      description: 'Your custom prompt', // Add your prompts
    },
  ],
};
```

### Change API Endpoint
**File**: `src/config/dify.config.ts`
```typescript
BASE_URL: 'https://your-custom-endpoint.com/v1',
```

## 🐛 Troubleshooting Checklist

### App won't start
- [ ] Ran `npm install`?
- [ ] Node.js 16+ installed?
- [ ] Port 3000 available?

### API not working
- [ ] Added API key to `dify.config.ts`?
- [ ] API key starts with `app-`?
- [ ] Correct Dify endpoint?
- [ ] Check browser console for errors

### Messages not streaming
- [ ] Dify app has streaming enabled?
- [ ] Check Network tab for SSE connection
- [ ] API key valid?

### Conversation history not working
- [ ] State is not persisted (refreshing page clears it)
- [ ] This is normal - add localStorage if needed

## 💡 Key Concepts

### Conversation ID Flow
```
Message 1: No ID → Dify creates → Returns conv-123
Message 2: Send conv-123 → Dify uses context
Message 3: Send conv-123 → Continues conversation
```

### Message States
- `loading`: Message is being sent/received
- `success`: Message completed successfully
- `error`: Message failed

### Component Communication
```
User Input → App → useDifyChat → DifyService → Dify API
                ↓
         Update Messages → Re-render Components
```

## 📦 NPM Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🎨 Styling

Uses `antd-style` with CSS-in-JS:
- Modify `src/styles/appStyles.ts` for global styles
- Each component can have inline styles
- Uses Ant Design theme tokens

## 🔐 Security Notes

⚠️ **Current Setup**: API key is in client code (development only)

**For Production**:
1. Move API key to backend
2. Create proxy endpoint
3. Add authentication
4. Never expose API key to client

## 📚 Key Dependencies

| Package | Purpose |
|---------|---------|
| `@ant-design/x` | AI chatbot components |
| `antd` | UI component library |
| `react` | UI framework |
| `typescript` | Type safety |
| `vite` | Build tool |
| `antd-style` | Styling solution |

## 🚀 Next Steps After Setup

1. **Test basic chat**: Send a message and verify streaming works
2. **Customize UI**: Change colors, text, prompts
3. **Add features**: File upload, conversation persistence
4. **Deploy**: Build and deploy to Vercel/Netlify

## 📖 Learn More

- Full setup: `SETUP.md`
- Architecture: `ARCHITECTURE.md`
- Detailed docs: `README.md`
- Ant Design X: https://x.ant.design/
- Dify API: https://docs.dify.ai/

## 🆘 Getting Help

Check these in order:
1. Browser console for errors
2. Network tab for API responses
3. `README.md` for detailed docs
4. Dify documentation
5. Ant Design X documentation

---

**Remember**: Add your API key to `src/config/dify.config.ts` before starting!
