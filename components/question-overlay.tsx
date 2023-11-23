import React from 'react';
import { QuestionList } from '@/components/questions-list';
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

  