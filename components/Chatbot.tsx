
import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../constants';
import { ChatMessage, ChatSession } from '../types';
import { marked } from 'marked';
import LoadingSpinner from './LoadingSpinner';
import { cx, styles } from '../styles';
import { createChatSession } from '../features/ai/api/geminiService';

interface ChatbotProps {
    isNavigationOpen?: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ isNavigationOpen = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<ChatSession | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chatSession = createChatSession();
        if (!chatSession) {
            setMessages([{ role: 'model', text: 'The AI assistant is currently unavailable because Gemini is not configured.' }]);
            return;
        }

        chatRef.current = chatSession;
        setMessages([{ role: 'model', text: 'Hello! How can I help you with your car today?' }]);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if(isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chatRef.current) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const stream = chatRef.current.sendMessageStream(currentInput);
            
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '...' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const ChatWindow = () => (
        <div className="motion-fade-in fixed bottom-24 right-4 z-50 flex h-[min(34rem,calc(100vh-8rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-[0_24px_70px_rgba(23,23,23,0.18)] sm:right-6">
            <header className="flex items-center justify-between bg-[#171717] p-5 text-white">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Always on call</p>
                    <h3 className="mt-1 text-base font-semibold">AI Assistant</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="rounded-lg p-2 text-white/55 transition hover:bg-white/10 hover:text-white">
                    {ICONS.close}
                </button>
            </header>
            <main className="flex-1 overflow-y-auto bg-background p-4">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                         <div key={index} className={cx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                            <div
                                className={cx('max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6', msg.role === 'user' ? 'rounded-br-md bg-primary text-white' : 'rounded-bl-md bg-secondary text-foreground')}
                                dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) as string }}
                            />
                        </div>
                    ))}
                    {isLoading && messages[messages.length-1].role === 'user' && (
                         <div className="flex justify-start">
                              <div className="max-w-xs rounded-2xl rounded-bl-md bg-secondary px-4 py-3 text-foreground">
                                <LoadingSpinner />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <footer className="border-t border-border p-3">
                <form onSubmit={handleSendMessage} className="flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask something..."
                        className={cx(styles.field, 'min-h-11 py-2')}
                        disabled={isLoading}
                    />
                    <button type="submit" className={cx(styles.button.base, styles.button.primary, styles.button.icon, 'ml-2')} disabled={isLoading} aria-label="Send message">
                       {ICONS.send}
                    </button>
                </form>
            </footer>
        </div>
    );


    return (
        <>
            {!isNavigationOpen && (
              <>
                {isOpen && <ChatWindow />}
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="motion-fab fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_12px_28px_rgba(255,105,77,0.3)]"
                  aria-label="Toggle chat"
                >
                  {isOpen ? ICONS.close : ICONS.chat}
                </button>
              </>
            )}
        </>
    );
};

export default Chatbot;
