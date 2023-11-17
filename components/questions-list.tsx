
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconArrowRight } from '@/components/ui/icons';
import { questions } from '@/lib/constants';
import styles from './ChatListContainer.module.css';

interface QuestionListProps {
  setInput: (input: string) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({ setInput }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const shuffleQuestions = useCallback(() => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, 4));
  }, []);

  useEffect(() => {
    shuffleQuestions();
  }, [shuffleQuestions]);

  return (
    <div>
      {/* Button to shuffle and select four new questions */}
      <Button
        variant="outline"
        className="text-white mb-4" // Add margin-bottom to separate from questions
        onClick={shuffleQuestions}
      >
        Shuffle Questions
      </Button>

      {selectedQuestions.map((question, index) => (
        <div key={index} className="mb-4">
          <Button
            variant="link"
            className="text-left text-base text-white flex items-center w-full"
            onClick={() => setInput(question)}
          >
            <IconArrowRight className="flex-shrink-0 mr-2" />
            <span className={`break-words flex-grow ${styles.customMarkdownFont}`}>{question}</span>
          </Button>
        </div>
      ))}
    </div>
  );
};