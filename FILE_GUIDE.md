# 📁 File Guide - What Each File Does

## 📂 Root Directory Files

### Configuration Files
| File | Purpose | Action Required |
|------|---------|-----------------|
| `package.json` | Project dependencies and scripts | ✅ No changes needed |
| `tsconfig.json` | TypeScript configuration | ✅ No changes needed |
| `tsconfig.node.json` | TypeScript config for Vite | ✅ No changes needed |
| `vite.config.ts` | Vite bundler settings | ✅ No changes needed |
| `index.html` | HTML template | ✅ No changes needed |
| `.gitignore` | Git ignore rules | ✅ No changes needed |
| `.env.example` | Environment variables template | ℹ️ Reference only |

### Documentation Files
| File | Purpose | When to Read |
|------|---------|--------------|
| `README.md` | Complete documentation | 📖 After setup |
| `SETUP.md` | Step-by-step setup guide | 🚀 First time setup |
| `QUICKSTART.md` | Quick reference guide | ⚡ Daily use |
| `ARCHITECTURE.md` | Technical deep dive | 🔧 Advanced customization |
| `PROJECT_SUMMARY.md` | Project overview | 👀 First look |
| `CHECKLIST.md` | Setup checklist | ✅ During setup |
| `FILE_GUIDE.md` | This file! | 📁 Understanding structure |

---

## 📂 src/ Directory

### Main Application Files
| File | Purpose | Modify? |
|------|---------|---------|
| `main.tsx` | App entry point | ❌ Rarely |
| `App.tsx` | Main app component | ⚠️ For major changes |
| `index.css` | Global styles | ✅ Yes, for styling |

---

## 📂 src/components/

### Component Files (Modify Often for UI Changes)
| File | What It Does | Customize For |
|------|--------------|---------------|
| `ChatSidebar.tsx` | Conversation list sidebar | App title, user avatar |
| `ChatMessageList.tsx` | Displays messages | Message appearance |
| `ChatWelcome.tsx` | Welcome screen with prompts | Welcome text, prompts |
| `ChatInput.tsx` | Message input box | Input placeholder, actions |
| `index.ts` | Component exports | ✅ No changes needed |

#### Customization Examples:

**ChatSidebar.tsx** - Change app name:
```typescript
<span>Dify Chat</span> // Line ~363
       ↓
<span>My Custom Bot</span>
```

**ChatWelcome.tsx** - Change welcome message:
```typescript
title="Hello, I'm your AI Assistant"
       ↓
title="Welcome to MyBot!"
```

**ChatInput.tsx** - Change placeholder:
```typescript
placeholder="Type your message here..."
       ↓
placeholder="Ask me anything..."
```

---

## 📂 src/config/

| File | Purpose | Action Required |
|------|---------|-----------------|
| `dify.config.ts` | Dify API configuration | ⚠️ **MUST EDIT** - Add API key |

**CRITICAL**: This is the most important file to edit!

```typescript
export const DIFY_CONFIG = {
  BASE_URL: 'https://api.dify.ai/v1',
  API_KEY: 'app-YOUR_API_KEY_HERE', // ← CHANGE THIS!
  USER_PREFIX: 'user-',
};
```

---

## 📂 src/hooks/

| File | Purpose | Modify? |
|------|---------|---------|
| `useDifyChat.ts` | Dify integration hook | ⚠️ Advanced only |

**What it handles**:
- Sending messages to Dify
- Processing streaming responses
- Managing loading states
- Error handling
- Request cancellation

**When to modify**:
- Adding custom message processing
- Implementing retry logic
- Adding message validation
- Custom error handling

---

## 📂 src/services/

| File | Purpose | Modify? |
|------|---------|---------|
| `difyService.ts` | Dify API client | ⚠️ Advanced only |

**What it handles**:
- HTTP requests to Dify API
- Server-Sent Events (SSE) parsing
- Conversation ID management
- Error handling
- Request abortion

**When to modify**:
- Changing API endpoints
- Adding new API methods
- Custom request/response handling
- Using different AI provider

---

## 📂 src/styles/

| File | Purpose | Modify? |
|------|---------|---------|
| `appStyles.ts` | App-wide styles | ✅ Yes, for styling |

**What's styled**:
- Layout and positioning
- Sidebar appearance
- Chat area styling
- Input box styling
- Colors and spacing

**Customization tip**: Uses Ant Design tokens for consistency.

---

## 📂 src/types/

| File | Purpose | Modify? |
|------|---------|---------|
| `index.ts` | TypeScript type definitions | ⚠️ When adding features |

**Defines types for**:
- Messages and conversations
- Dify API requests/responses
- Component props
- State management

**When to modify**:
- Adding new message types
- Extending conversation features
- Adding custom metadata

---

## 🎯 Quick Reference: What to Edit

### ⚠️ Must Edit
- `src/config/dify.config.ts` - Add your API key

### ✅ Often Edit
- `src/components/ChatSidebar.tsx` - App branding
- `src/components/ChatWelcome.tsx` - Welcome message
- `src/components/ChatInput.tsx` - Input customization
- `src/styles/appStyles.ts` - Styling changes
- `src/index.css` - Global styles

### ℹ️ Sometimes Edit
- `src/App.tsx` - Major feature additions
- `src/types/index.ts` - New data types

### ❌ Rarely Edit
- `src/main.tsx` - Entry point
- `src/hooks/useDifyChat.ts` - Core logic
- `src/services/difyService.ts` - API client
- `*.json`, `*.config.ts` - Build configuration

---

## 📊 File Size Reference

| Size | File Type |
|------|-----------|
| Small (< 100 lines) | Config, types, index files |
| Medium (100-300 lines) | Components, hooks |
| Large (300+ lines) | Main app, services |

---

## 🗺️ Development Workflow

### Starting a new feature:
1. Check `src/types/index.ts` - Do you need new types?
2. Modify `src/services/difyService.ts` - New API calls?
3. Update `src/hooks/useDifyChat.ts` - New logic?
4. Create/modify components in `src/components/` - UI changes
5. Update `src/App.tsx` - Integrate new feature

### Styling changes:
1. Global: Edit `src/index.css`
2. Component-specific: Edit `src/styles/appStyles.ts`
3. Inline: Add styles directly in component files

### Bug fixing:
1. Browser console - Check for errors
2. Network tab - Check API calls
3. `src/services/difyService.ts` - API issues
4. `src/hooks/useDifyChat.ts` - State issues
5. Component files - UI issues

---

## 💡 Pro Tips

1. **Start with docs**: Read `README.md` before editing code
2. **Use TypeScript**: Let types guide you
3. **Check examples**: See how existing code works
4. **Test frequently**: Run `npm run dev` after changes
5. **Git branches**: Create branches for experiments

---

## 🔍 Finding Things

### "Where do I change X?"

| What | Where |
|------|-------|
| API key | `src/config/dify.config.ts` |
| App title | `src/components/ChatSidebar.tsx` |
| Welcome message | `src/components/ChatWelcome.tsx` |
| Input placeholder | `src/components/ChatInput.tsx` |
| Colors | `src/styles/appStyles.ts` |
| Message display | `src/components/ChatMessageList.tsx` |
| API calls | `src/services/difyService.ts` |
| Message logic | `src/hooks/useDifyChat.ts` |
| Types | `src/types/index.ts` |
| Global styles | `src/index.css` |

---

**Remember**: Most common edits are in:
1. `src/config/dify.config.ts` (API key)
2. `src/components/` (UI changes)
3. `src/styles/appStyles.ts` (styling)

Everything else is production-ready! 🚀
