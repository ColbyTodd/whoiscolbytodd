import { useState, useRef } from 'react'
import api from '../api'

function ChatBox() {
  const [messages, setMessages] = useState([])
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
      const response = await api.post('/chat', { message: inputValue })
      
      // Handle streaming or non-streaming response
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
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: 'Connection to AI service failed. Please check your network connection.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Messages history */}
      <div className="h-96 overflow-y-auto border-2 border-terminal-border rounded-lg p-4 bg-terminal-dark">
        {messages.length === 0 ? (
          <p className="text-terminal-muted text-center mt-8 italic">
            Start a conversation by asking me something...
          </p>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-4 ${
                msg.role === 'user' ? 'text-right' : msg.role === 'system' ? 'text-center text-terminal-muted' : 'text-left'
              }`}
            >
              {msg.role !== 'system' && (
                <div className="inline-block px-4 py-2 rounded-lg bg-terminal-bg border border-terminal-border">
                  {msg.content}
                </div>
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
