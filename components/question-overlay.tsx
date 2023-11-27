import React from 'react';
import { QuestionList } from '@/components/questions-list';
import { QuestionListLeftPanel } from '@/components/questions-list-left-panel-and-mobile';
import styles from './QuestionsOverlay.module.css'; // Import the CSS module

export interface QuestionsOverlayProps {
  onSubmit: (value: string) => void; // Function to submit the chat input
}

// Inside QuestionsOverlay component
export const QuestionsOverlay: React.FC<QuestionsOverlayProps> = ({ onSubmit }) => {
    return (
      <div className={styles.questionsOverlay}>
        <QuestionList onSubmit={onSubmit} />
      </div>
    );
  };

  // Inside QuestionsOverlay component
export const QuestionsOverlayLeftPanel: React.FC<QuestionsOverlayProps> = ({ onSubmit }) => {
  return (
    <div className={styles.questionsOverlayLeftPanel}>
      <QuestionListLeftPanel onSubmit={onSubmit} />
    </div>
  );
};

