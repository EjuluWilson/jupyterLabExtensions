// src/components/ConversationPanel.tsx
import React, { useState, useRef, useEffect } from 'react';

interface Message {
  isUser: boolean;
  text: string;
}

export const ConversationPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const newMessages = [...messages, { isUser: true, text: inputText }];
    setMessages(newMessages);

    // Simulate system response
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages,
        { isUser: false, text: `System: Received "${inputText}"` }
      ]);
    }, 300);

    // Clear input
    setInputText('');
  };

  return (
    <div className="jp-ConversationPanel">
      <div className="jp-ConversationOutput">
        {messages.map((msg, i) => (
          <div key={i} className={msg.isUser ? 'jp-UserMessage' : 'jp-SystemMessage'}>
            {msg.isUser ? 'User: ' : ''}{msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="jp-ConversationInputContainer">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="jp-ConversationInput"
        />
        <button 
          onClick={handleSend}
          className="jp-ConversationButton"
        >
          Send
        </button>
      </div>
    </div>
  );
};