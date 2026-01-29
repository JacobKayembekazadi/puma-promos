
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types';
import { getChatResponseStream } from '../../services/aiService';

const XIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> );
const SendIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> );
const RobotIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg> );

interface ChatSidebarProps { isOpen: boolean; onClose: () => void; }

const initialMessages: ChatMessage[] = [ { role: 'model', content: "Hi! 👋 I'm the PumaPromos assistant.\n\nI can help you with:\n• Product recommendations\n• Pricing questions\n• Customization options\n• Order inquiries\n\nWhat can I help you with?", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } ];

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
    useEffect(() => { if(isOpen) { setTimeout(scrollToBottom, 300); } }, [isOpen, messages]);
    
    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        
        const userMessage: ChatMessage = { role: 'user', content: input, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        const modelMessage: ChatMessage = { role: 'model', content: '', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, modelMessage]);

        try {
            const stream = getChatResponseStream(messages, currentInput);
            let content = '';
            for await (const chunk of stream) {
                content += chunk;
                setMessages(prev => {
                    const lastMsg = { ...prev[prev.length -1], content };
                    return [...prev.slice(0, -1), lastMsg];
                });
            }
        } catch (error) {
             setMessages(prev => {
                    const lastMsg = {...prev[prev.length - 1], content: 'Sorry, I am having trouble connecting. Please try again.' };
                    return [...prev.slice(0, -1), lastMsg];
                });
        } finally { setIsLoading(false); }
    };

    return (
      <>
        <div className={`fixed inset-0 bg-black/50 z-[59] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
        <div className={`fixed top-0 right-0 h-full bg-background-primary shadow-2xl z-[60] transition-transform duration-300 flex flex-col border-l border-border ${isOpen ? 'translate-x-0' : 'translate-x-full'} w-full max-w-md`}>
          <header className="bg-background-secondary p-4 flex justify-between items-center shrink-0">
            <div>
              <h3 className="font-bold text-text-primary">PumaPromos Assistant</h3>
              <p className="text-sm text-text-secondary">Typically replies instantly</p>
            </div>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><XIcon /></button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-background-card text-white flex items-center justify-center shrink-0"><RobotIcon/></div>}
                    <div className={`max-w-[80%] rounded-2xl p-3 ${msg.role === 'user' ? 'bg-accent text-text-dark rounded-br-none' : 'bg-background-card text-text-primary rounded-bl-none'}`}>
                        <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content || '...'}</p>
                        <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-black/70 text-right' : 'text-text-secondary'}`}>{msg.timestamp}</p>
                    </div>
                    {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-hover text-text-primary flex items-center justify-center font-bold shrink-0">U</div>}
                </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border bg-background-primary shrink-0">
            <div className="relative">
              <textarea
                value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask about products, pricing..." rows={1}
                className="w-full p-3 pr-12 bg-background-secondary border border-border rounded-lg resize-none text-text-primary placeholder-text-secondary focus:border-accent focus:ring-1 focus:ring-accent" disabled={isLoading}
              />
              <button onClick={handleSend} disabled={isLoading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-text-dark bg-accent hover:bg-accent-hover disabled:bg-hover disabled:text-text-secondary">
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </>
    );
};
export default ChatSidebar;
