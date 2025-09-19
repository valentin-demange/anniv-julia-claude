'use client';

import { useState } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolé ma queen, j&apos;ai un petit souci technique! 😅 Peux-tu réessayer?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-yellow-200">
      {/* Birthday decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl animate-bounce">🎈</div>
        <div className="absolute top-20 right-20 text-5xl animate-pulse">🎂</div>
        <div className="absolute top-40 left-1/4 text-4xl animate-bounce delay-300">🎁</div>
        <div className="absolute bottom-20 right-10 text-5xl animate-pulse delay-500">🎉</div>
        <div className="absolute bottom-40 left-20 text-4xl animate-bounce delay-700">🎊</div>
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-lg p-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 bg-clip-text text-transparent mb-2">
              Joyeux Anniversaire Julia! 🎉
            </h1>
            <p className="text-lg md:text-xl text-gray-700 font-medium">
              Tes amis ont une surprise pour toi... Parle avec moi pour découvrir! 🎭
            </p>
          </div>
        </header>

        {/* Chat Container */}
        <div className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col">
          {/* Messages */}
          <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-600 mt-20">
                <div className="text-6xl mb-4">🤖</div>
                <p className="text-xl mb-2">Salut ma queen! 👑</p>
                <p className="text-lg">Commence la conversation pour découvrir ta surprise d&apos;anniversaire!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.isUser
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800'
                      }`}
                    >
                      <p className="text-lg whitespace-pre-wrap leading-relaxed">{message.text}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 p-4 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Écris ton message ici..."
                className="flex-1 p-4 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg text-gray-800 placeholder:text-gray-500"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputText.trim()}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg font-medium"
              >
                Envoyer 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
