import { useState, useRef } from 'react'
import api from '../api'

function ChatBox() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '> Welcome to the terminal!\n\n> I am Colby Todd\'s AI assistant.\n> Ask me about my career, projects, or hobbies.' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesRef = useRef(null)

  const autoScrollToBottom = () => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: inputValue }])
    setInputValue('')
    setIsLoading(true)

    try {
      // Try real API call first
      const response = await api.post('/chat', { message: inputValue })
      
      // Handle streaming or non-streaming response from backend
      if (response.data.choices && response.data.choices[0].delta) {
        let accumulatedText = ''
        
        for await (const chunk of response.data.stream) {
          const content = JSON.parse(chunk).choices[0].delta.content || ''
          accumulatedText += content
          setMessages(prev => prev.map(m => 
            m.role === 'assistant' ? { ...m, content: accumulatedText } : m
          ))
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.choices[0].message.content }])
      }
    } catch (error) {
      console.error('Error:', error)
      // Provide mock canned responses when no backend is available
      const mockResponses = [
        "I'm here to help! Ask me about my work history, projects, or hobbies.",
        "That's an interesting question. I specialize in full-stack development and AI/ML.",
        "Sure! I've worked with React, Node.js, Python, and various cloud platforms.",
        "I'm passionate about building scalable web applications and open-source tools.",
        "Feel free to ask more - I love learning about new technologies!",
      ]
      
      // Pick a random canned response
      const randomIndex = Math.floor(Math.random() * mockResponses.length)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `> ${mockResponses[randomIndex]}`
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Messages history */}
      <div ref={messagesRef} className="h-96 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-terminal-muted text-center mt-8 italic">
            Start a conversation by asking me something...
          </p>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-3 ${
                msg.role === 'user' ? 'text-left' : msg.role === 'system' ? 'text-center text-terminal-muted' : 'text-left'
              }`}
            >
              {msg.role !== 'system' && (
                <span className="text-white">{msg.content}</span>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="ml-1 text-terminal-muted animate-pulse">
            Thinking...
          </div>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me anything..."
          className="w-full px-4 py-3 bg-terminal-dark border-2 border-terminal-border rounded-lg focus:outline-none focus:border-terminal-primary text-white placeholder-terminal-muted"
        />
      </form>
    </div>
  )
}

export default ChatBox
