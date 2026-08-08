import Header from './components/Header'
import ChatBox from './components/ChatBox'

function App() {
  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-primary p-6">
      <Header />
      <main className="w-full mt-8">
        <ChatBox />
      </main>
    </div>
  )
}

export default App
