import React from 'react';
import { QuestionList } from '@/components/questions-list';
import { QuestionListLeftPanel } from '@/components/questions-list-left-panel-and-mobile';
import styles from './QuestionsOverlay.module.css'; // Import the CSS module

export interface QuestionsOverlayProps {
  setInput: (input: string) => void; // Function to set the chat input
}

// Inside QuestionsOverlay component
export const QuestionsOverlay: React.FC<QuestionsOverlayProps> = ({ setInput }) => {
    return (
      <div className={styles.questionsOverlay}>
        <QuestionList setInput={setInput} />
      </div>
    );
  };

  // Inside QuestionsOverlay component
export const QuestionsOverlayLeftPanel: React.FC<QuestionsOverlayProps> = ({ setInput }) => {
  return (
    <div className={styles.questionsOverlayLeftPanel}>
      <QuestionListLeftPanel setInput={setInput} />
    </div>
  );
};

