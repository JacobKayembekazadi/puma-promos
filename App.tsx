
import React, { useState } from 'react';
import Header from './components/landing/Header';
import Hero from './components/landing/Hero';
import CategoryCards from './components/landing/CategoryCards';
import TrustIndicators from './components/landing/TrustIndicators';
import QuoteModal from './components/quote/QuoteModal';
import FloatingChatButton from './components/chat/FloatingChatButton';
import ChatSidebar from './components/chat/ChatSidebar';

export default function App() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChatFromQuote = () => {
    setIsQuoteModalOpen(false);
    // Use a timeout to ensure smooth transition between modal closing and sidebar opening
    setTimeout(() => {
      setIsChatOpen(true);
    }, 300);
  };

  return (
    <div className="bg-background-primary font-sans">
      <Header onGetQuoteClick={() => setIsQuoteModalOpen(true)} />
      <main>
        <Hero onGetQuoteClick={() => setIsQuoteModalOpen(true)} />
        <CategoryCards />
        <TrustIndicators />
      </main>
      <FloatingChatButton onClick={() => setIsChatOpen(true)} />
      
      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
        onOpenChat={openChatFromQuote}
      />

      <ChatSidebar
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}
