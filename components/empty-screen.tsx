import { UseChatHelpers } from 'ai/react'
import { QuestionList } from './questions-list'
import { QuestionsOverlay, QuestionsOverlayProps, QuestionsOverlayLeftPanel } from './question-overlay';
import { useState, useEffect } from 'react';
import styles from './QuestionsOverlay.module.css'; // Import the CSS module

//   <QuestionList setInput={setInput} />

export function EmptyScreen({setInput}: QuestionsOverlayProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Set the initial value
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const overlayClass = isMobile ? `${styles.questionsOverlay} ${styles.mobileHide}` : styles.questionsOverlay;
  
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8 text-left">
        <h1 className="mb-2 text-lg font-semibold text-white">
          mev.fyi is the Maximal Extractable Value (MEV) research chatbot.
        </h1>
        <p className="mb-4 leading-normal text-muted-foreground">
          Find the latest MEV-related research, 
          across mechanism design, auctions, information privacy, from research papers and YouTube videos.
        </p>
      </div>
      
      <div className={overlayClass}>
          {(isMobile) && (
            <QuestionsOverlayLeftPanel setInput={setInput} />
          )}
      </div>
    </div>
  );
}