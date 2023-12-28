import { QuestionsOverlay, QuestionsOverlayLeftPanel, QuestionsOverlayProps } from './question-overlay';
import { useState, useEffect } from 'react';
import styles from './QuestionsOverlay.module.css';

export function EmptyScreen({ onSubmit }: QuestionsOverlayProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use separate classes for mobile and desktop to maintain the layout
  const overlayClass = isMobile ? `${styles.questionsOverlay} ${styles.mobileHide}` : styles.questionsOverlay;
  const fadeInOutClass = isMobile ? styles.fadeIn : styles.fadeOut; // Apply fade in/out based on mobile view

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
      
      <div className={`${overlayClass} ${fadeInOutClass}`}>
        {isMobile ? (
          <QuestionsOverlayLeftPanel onSubmit={onSubmit} />
        ) : (
          <QuestionsOverlay onSubmit={onSubmit} />
        )}
      </div>
    </div>
  );
}
