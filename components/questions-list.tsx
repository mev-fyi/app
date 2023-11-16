import { UseChatHelpers } from 'ai/react'
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconArrowRight } from '@/components/ui/icons';
import { questions } from '@/lib/constants'; // Ensure the path is correct
import styles from './ChatListContainer.module.css'; // Adjust the path if necessary

export const QuestionList = ({ setInput }: Pick<UseChatHelpers, 'setInput'>) => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const shuffleQuestions = () => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, 4));
  };

  useEffect(() => {
    shuffleQuestions();
  }, []);

  return (
    <div>
      {selectedQuestions.map((question, index) => (
        <div key={index} className="mb-4"> {/* Add margin-bottom to each question */}
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
      {/* New Button to shuffle and select four questions */}
      <div className="mt-4">
          <Button
            variant="outline" // Corrected variant value
            className="text-white" // Add additional styling as needed
            onClick={shuffleQuestions}
          >
            Shuffle new questions
          </Button>
        </div>
    </div>
  );
};
