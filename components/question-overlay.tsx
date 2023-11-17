import React from 'react';
import { QuestionList } from '@/components/questions-list';
import styles from './questions-overlay.module.css'; // Ensure the path and filename match your CSS module

interface QuestionsOverlayProps {
  setInput: (input: string) => void; // Function to set the chat input
}

export const QuestionsOverlay: React.FC<QuestionsOverlayProps> = ({ setInput }) => {
  return (
    <div className={styles.questionsOverlay}>
      <QuestionList setInput={setInput} />
    </div>
  );
};