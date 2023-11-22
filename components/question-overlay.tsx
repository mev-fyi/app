import React from 'react';
import { QuestionList } from '@/components/questions-list';
import styles from './QuestionsOverlay.module.css'; // Import the CSS module

interface QuestionsOverlayProps {
  setInput: (input: string) => void;
  className?: string;  // Optional className prop
}

// Inside QuestionsOverlay component
export const QuestionsOverlay: React.FC<QuestionsOverlayProps> = ({ setInput }) => {
    return (
      <div className={styles.questionsOverlay}>
        <QuestionList setInput={setInput} />
      </div>
    );
  };

  