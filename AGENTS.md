# Personal Portfolio + AI Terminal Chat

## Project Overview
Personal website acting as both:  
1. A visual resume/portfolio showcasing career and hobbies  
2. An interactive terminal-style chat UI powered by an AI backend  

The site should look like a terminal (similar to OpenCode) with monospace styling, dark theme, and command-line aesthetic.

## Core Architecture

### Frontend
- Terminal-style UI: monospace font, dark background, CLI-like layout
- Chat interface for user questions about career/hobbies
- Likely needs: React/Vue/Svelte + terminal emulation library (xterm.js) or custom styling

### Backend AI
- LLM service with context of your work history and hobbies  
- Exposed via API endpoints called by frontend chat UI  
- Context injection from resume/portfolio data

## Critical Setup Order
1. Set up project scaffold (framework choice TBD)  
2. Configure terminal styling/fonts early (terminal look is core to UX)  
3. Implement chat UI before backend integration  
4. Build AI backend with context management before connecting frontend  
5. Test end-to-end: user types question → receives contextual AI response

## Terminal Styling Checklist
- Use monospace font family (Fira Code, JetBrains Mono, etc.)  
- Dark color scheme (black/gray palette)  
- Consider CRT/scanline effects if desired aesthetic  
- Cursor styling matching terminal conventions  

## API Contract
Frontend chat should POST to backend with:
- `message`: user question  
- `context` (optional): specific topic area (career/hobbies)

Backend responds with streaming JSON or SSE for real-time chat feel.

## Common Pitfalls to Avoid
- Don't overengineer terminal effects early; get core chat working first  
- Ensure AI context is properly scoped and not leaking between unrelated topics  
- Test chat locally before deployment (LLM costs + latency)  
- Handle rate limits/throttling from LLM provider in backend  

## Commands You'll Need
```bash
# Run dev server (once scaffold chosen)
npm run dev

# Typecheck if using TS
npm run typecheck

# Build for production
npm run build
```

## Environment Variables to Document
- `LLM_API_KEY`: for AI backend  
- `FRONTEND_URL`: for CORS proxying if needed  
- Optional: streaming endpoint configs  

## Next Steps After Scaffold
1. Wire up terminal UI styling  
2. Implement chat message history state  
3. Build minimal LLM API route with context injection  
4. Test full user flow end-to-end
