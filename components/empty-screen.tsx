import { UseChatHelpers } from 'ai/react'
import { QuestionList } from './questions-list'
import { QuestionsOverlay, QuestionsOverlayProps, QuestionsOverlayLeftPanel } from './question-overlay';
import { useState, useEffect } from 'react';
import styles from './QuestionsOverlay.module.css'; // Import the CSS module

//   <QuestionList onSubmit={onSubmit} />

export function EmptyScreen({onSubmit}: QuestionsOverlayProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true); // New state to control overlay visibility

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setShowOverlay(true); // Show overlay when screen size changes
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const overlayClass = `${styles.questionsOverlay} ${isMobile ? styles.mobileHide : showOverlay ? styles.fadeIn : styles.fadeOut}`;
  
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8 text-left">
        <h1 className="mb-2 text-lg font-semibold text-white">
          mev.fyi is the Maximal Extractable Value (MEV) research chatbot.
        </h1>
        {isMobile ? (
          <p className="mb-4 leading-normal text-muted-foreground">
            Get started with an example:
          </p>
        ) : (
          <p className="mb-4 leading-normal text-muted-foreground">
            Find the latest MEV-related research, 
            across mechanism design, auctions, information privacy, from research papers and YouTube videos.
          </p>
        )}
      </div>
      
      <div className={overlayClass}>
        {(isMobile || showOverlay) && (
          <QuestionsOverlayLeftPanel onSubmit={onSubmit} />
        )}
      </div>
    </div>
  );
}