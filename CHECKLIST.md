# ✅ Setup Checklist

Use this checklist to get your Dify chatbot up and running!

## 📋 Pre-Installation

- [ ] Node.js 16+ installed
  ```bash
  node --version  # Should be v16 or higher
  ```
- [ ] npm/yarn/pnpm available
  ```bash
  npm --version
  ```
- [ ] Code editor ready (VS Code recommended)
- [ ] Dify account created at https://dify.ai

## 🔑 Get Your Dify API Key

- [ ] Log in to Dify dashboard
- [ ] Create or select an application
- [ ] Navigate to "API Access" section
- [ ] Copy your API key (starts with `app-`)
- [ ] Save it somewhere safe (you'll need it soon!)

## 📦 Installation Steps

- [ ] Navigate to project directory
  ```bash
  cd dify-chatbot
  ```
- [ ] Install dependencies
  ```bash
  npm install
  ```
- [ ] Wait for installation to complete (may take 1-2 minutes)
- [ ] Verify no errors in terminal

## ⚙️ Configuration

- [ ] Open `src/config/dify.config.ts`
- [ ] Find this line:
  ```typescript
  API_KEY: 'app-YOUR_API_KEY_HERE',
  ```
- [ ] Replace `app-YOUR_API_KEY_HERE` with your actual API key
- [ ] Save the file
- [ ] Double-check the API key is correct (no extra spaces)

## 🚀 First Run

- [ ] Start development server
  ```bash
  npm run dev
  ```
- [ ] Check terminal for success message
- [ ] Browser should open automatically to `http://localhost:3000`
- [ ] If not, manually open `http://localhost:3000`

## ✨ Test Basic Functionality

- [ ] See the welcome screen with "Hello, I'm your AI Assistant"
- [ ] Click on a prompt suggestion OR type a message
- [ ] Press Enter or click Send button
- [ ] See the message appear in chat
- [ ] See AI response streaming in real-time
- [ ] Response completes without errors

## 🔍 Verify Advanced Features

- [ ] Send a follow-up message
  - [ ] Context is maintained (AI remembers previous message)
- [ ] Click "New Conversation" button
  - [ ] New conversation is created
  - [ ] Chat area is cleared
- [ ] Send a message in new conversation
- [ ] Switch between conversations
  - [ ] Message history is maintained
  - [ ] Each conversation is independent

## 🎨 Optional: Customize UI

- [ ] Change app title in `ChatSidebar.tsx`
- [ ] Modify welcome message in `ChatWelcome.tsx`
- [ ] Update prompt suggestions
- [ ] Test changes appear correctly

## 📝 Documentation Review

- [ ] Skim through `README.md` for full features
- [ ] Check `QUICKSTART.md` for quick reference
- [ ] Review `ARCHITECTURE.md` if interested in technical details
- [ ] Bookmark `SETUP.md` for detailed instructions

## 🐛 Troubleshooting (If Needed)

If something doesn't work, check:

- [ ] API key is correct in `dify.config.ts`
- [ ] API key starts with `app-`
- [ ] No extra quotes or spaces in API key
- [ ] Node.js version is 16+
- [ ] Port 3000 is not in use
- [ ] Dependencies installed successfully
- [ ] Browser console for error messages
- [ ] Network tab for failed API requests

## 🎯 Common Issues & Solutions

### Issue: "Cannot find module" error
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 already in use"
**Solution**: Kill process using port 3000 or change port in `vite.config.ts`

### Issue: "Failed to fetch" or CORS error
**Solution**: Verify API key and check Dify API status

### Issue: Messages not streaming
**Solution**: Check Dify app has streaming enabled in settings

## ✅ You're Ready When...

- [x] App loads without errors
- [x] You can send messages
- [x] AI responds with streaming
- [x] Conversations switch properly
- [x] New conversations can be created
- [x] Previous messages are maintained

## 🎉 Success!

If you've checked all the boxes above, congratulations! Your Dify chatbot is fully operational.

## 📚 Next Steps

Now that everything works, consider:

1. **Customization**
   - Change colors and styling
   - Add your branding
   - Modify prompts and messages

2. **Features**
   - Add conversation persistence
   - Implement search functionality
   - Add file upload support

3. **Deployment**
   - Build for production: `npm run build`
   - Deploy to Vercel, Netlify, or your hosting

4. **Learning**
   - Study the code structure
   - Experiment with modifications
   - Read the architecture docs

## 📞 Need Help?

1. Check browser console for errors
2. Review `README.md` documentation
3. Check Dify API documentation
4. Verify API key is correct
5. Ensure internet connection is stable

---

**Remember**: The most common issue is forgetting to add the API key in `src/config/dify.config.ts`!

Happy coding! 🚀
