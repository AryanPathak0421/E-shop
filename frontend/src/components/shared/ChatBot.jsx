import React, { useState, useRef, useEffect } from 'react';
import { chatService } from '../../services/chatService.js';
import { formatDate } from '../../utils/formatters.js';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(inputValue);
      const botMessage = {
        id: Date.now() + 1,
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I could not process your request at this time. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Premium Floating Trigger Button with Halo Ring */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-glow hover:scale-105 active:scale-95 transition-all text-xl z-40 border border-white/10 group focus:outline-none"
      >
        <span className="group-hover:rotate-12 transition-transform duration-200">💬</span>
        <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping pointer-events-none" />
      </button>

      {/* Futuristic Glassmorphic Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[480px] glass-panel rounded-2xl flex flex-col z-40 overflow-hidden border border-white/10 shadow-premium animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#161c2d] to-[#0f172a] p-4 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🤖</span>
              <div>
                <h3 className="font-display font-bold text-white text-sm">AI Store Assistant</h3>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live & Grounded
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-lg"
            >
              ×
            </button>
          </div>

          {/* Messages Board */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/20">
            {messages.length === 0 && (
              <div className="text-center py-12 px-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-xl">
                  ✨
                </div>
                <div className="space-y-1">
                  <p className="text-white text-sm font-semibold">Welcome to the future of shopping!</p>
                  <p className="text-xs text-gray-400">Ask about catalog stock, prices, order history, or refund policies.</p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none shadow-md shadow-indigo-600/10 border border-white/10'
                      : 'bg-slate-900/80 text-gray-200 border border-white/5 rounded-bl-none'
                  }`}
                >
                  <p className="text-xs leading-relaxed whitespace-pre-line">{msg.text}</p>
                  <p className="text-[9px] opacity-60 mt-1.5 text-right font-light">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-900/80 text-gray-400 px-4 py-3 rounded-2xl rounded-bl-none border border-white/5 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* User Input controls */}
          <div className="p-4 bg-slate-950/40 border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me something..."
              className="flex-1 bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-gray-500 disabled:opacity-50"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-md shadow-indigo-600/10 disabled:opacity-40 transition-all glow-btn"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}