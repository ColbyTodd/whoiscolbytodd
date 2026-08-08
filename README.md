# Who is Colby Todd?

A personal portfolio website with an interactive AI-powered terminal chat interface. Ask questions about career history, projects, and hobbies directly in a CLI-style chat UI.

## Features

- **Terminal-Style Interface** - Dark theme with monospace font for authentic command-line aesthetic
- **AI Chat Assistant** - Interactive chat powered by LLM to answer questions about:
  - Career background and experience
  - Personal projects and portfolio
  - Hobbies and interests
- **Responsive Design** - Works on desktop and mobile devices
- **Streaming Responses** - Real-time AI responses as they're generated

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS with custom terminal theme
- **Backend API**: Node.js/Express (separate service)

## Getting Started

### Prerequisites

- Node.js 18+ 
- An LLM provider API key (OpenAI, Anthropic, etc.)

### Installation

```bash
# Clone or navigate to repository
cd whoiscolbytodd

# Install dependencies
npm install

# Start development server
npm run dev
```

Or use the convenient launcher script:

```bash
chmod +x run.sh
./run.sh
```

### Backend Setup

The frontend connects to a backend AI service at `http://localhost:8000` by default. Configure in [`src/api.js`](src/api.js):

```javascript
const API_URL = 'http://your-backend-url'
```

#### Backend Options

1. **OpenAI API** - Self-hosted OpenAI or Cloudflare Workers with OpenAI compatibility
2. **Anthropic API** - Via compatible endpoint
3. **Local LLM** - Ollama, llama.cpp, or other local inference service

Example backend using OpenAI:

```javascript
// server.js (backend)
const express = require('express')
const { openai } = require('@ai-sdk/openai')

const app = express()

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: `You are Colby Todd, a helpful AI assistant.` },
      { role: 'user', content: userMessage }
    ],
    stream: true
  })

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  
  for await (const chunk of response) {
    if (chunk.done) continue
    const content = chunk.choices[0]?.delta?.content || ''
    res.write(`data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`)
  }
})

app.listen(8000)
```

### Customizing the AI Context

The system prompt (backend) should include your resume and portfolio data. Example context injection:

```javascript
const context = `
About Colby Todd:
- Full Name: ${full_name}
- Location: ${location}
- Bio: ${bio}
- Skills: ${skills.join(', ')}
- Experience: [career history]
- Projects: [projects]
- Hobbies: [hobbies]
`

const messages = [
  { role: 'system', content: `You are Colby Todd. Here's information about me: ${context}` },
  { role: 'user', content: userMessage }
]
```

## Project Structure

```
├── index.html          # Main HTML entry point
├── src/
│   ├── main.jsx        # React root
│   ├── App.jsx         # Main app component
│   ├── api.js          # API client configuration
│   ├── components/
│   │   ├── Header.jsx  # Header with title
│   │   └── ChatBox.jsx # Chat interface component
│   └── index.css       # Tailwind styles
├── tailwind.config.js  # Theme colors and config
└── vite.config.js      # Build configuration
```

## Configuration

### `tailwind.config.js` - Terminal Theme Colors

Edit these to match your preferred terminal style:

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'terminal': {
          bg: '#0d1117',      // Dark background (GitHub dark dimmed)
          primary: '#c9d1d9', // Text color (GitHub comment gray)
          muted: '#8b949e',   // Muted text
          border: '#30363d',  // Border color
          dark: '#161b22'     // Input/message bg
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
}
```

## Building for Production

```bash
npm run build
```

Output will be in `dist/` directory. Deploy the contents to any static hosting service.

## API Endpoints

The frontend expects these endpoints from your backend:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/chat` | POST | Handle chat messages |

### Request Format

```json
{
  "message": "What projects have you worked on?"
}
```

### Response Format (Streaming)

```json
{"choices":[{"delta":{"content":"I've worked..."}}]}
```

### Response Format (Non-streaming)

```json
{
  "data": {
    "choices": [{
      "message": {"content": "Complete response..."}
    }]
  }
}
```

## Environment Variables

For backend service:

```bash
OPENAI_API_KEY=sk-your-key-here
LLM_PROVIDER=openai  # or anthropic, ollama, etc.
```

## Deployment Notes

- Frontend can be deployed anywhere (GitHub Pages, Vercel, Netlify, S3)
- Backend should be on a server with LLM API access
- Consider CORS if using different domains for frontend/backend
- Add HTTPS in production

## License

MIT License - feel free to use this as a template for your own portfolio!
