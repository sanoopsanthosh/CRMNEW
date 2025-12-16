import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Send, Bot, User, Sparkles } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: "Hello! I'm your ETIMAD AI assistant. I can help you analyze market trends, draft content, or answer questions about your inventory." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Chat
  useEffect(() => {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      chatSessionRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are a helpful, professional AI assistant for a luxury used car dealership CRM called ETIMAD. You understand high-end cars, sales, and premium customer service.',
        },
      });
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessageStream({ message: userMsg });
      
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: '' }]); // Placeholder

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
            fullResponse += c.text;
            setMessages(prev => {
                const newArr = [...prev];
                newArr[newArr.length - 1] = { role: 'model', text: fullResponse };
                return newArr;
            });
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error connecting to the AI service." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
        <div className="mb-6 border-b border-stone-200 pb-4">
            <h1 className="text-3xl font-bold text-stone-900 flex items-center gap-3 font-serif">
                <Sparkles className="text-amber-600" size={28}/> 
                AI Assistant
            </h1>
            <p className="text-stone-500 mt-1">Ask about market trends, luxury car comparisons, or sales strategies.</p>
        </div>

        <div className="flex-1 bg-white rounded-sm shadow-sm border border-stone-100 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-4`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-red-900 text-white' : 'bg-white text-stone-800 border border-stone-200'}`}>
                                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                            </div>
                            <div className={`p-4 text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-red-900 text-white rounded-l-xl rounded-br-sm' 
                                : 'bg-white text-stone-800 border border-stone-200 rounded-r-xl rounded-bl-sm'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-full shadow-sm border border-stone-200 ml-14">
                             <div className="w-2 h-2 bg-red-900 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                             <div className="w-2 h-2 bg-red-900 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                             <div className="w-2 h-2 bg-red-900 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-5 bg-white border-t border-stone-200">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={process.env.API_KEY ? "Ask Gemini something..." : "API Key Required in Environment"}
                        disabled={!process.env.API_KEY || isLoading}
                        className="flex-1 border border-stone-300 rounded-sm px-4 py-3 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 disabled:bg-stone-100 text-stone-800 placeholder-stone-400"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="bg-red-900 text-white rounded-sm px-6 py-2 hover:bg-red-950 disabled:opacity-50 disabled:hover:bg-red-900 transition-colors shadow-md"
                    >
                        <Send size={20} />
                    </button>
                </div>
                {!process.env.API_KEY && (
                    <p className="text-xs text-red-600 mt-2 text-center font-bold">
                        Please set React.env.API_KEY to use the AI features.
                    </p>
                )}
            </div>
        </div>
    </div>
  );
};

export default AIAssistant;