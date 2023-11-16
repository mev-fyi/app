import { UseChatHelpers } from 'ai/react'
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconArrowRight } from '@/components/ui/icons';
import { questions } from '@/lib/constants'; // Ensure the path is correct

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
        <Button
          key={index}
          variant="link"
          className="text-left p-0 text-base text-white flex items-center w-full"
          onClick={() => setInput(question)}
          style={{ justifyContent: 'flex-start' }} // Use inline styles to override any existing flexbox styles
        >
          <IconArrowRight className="flex-shrink-0 mr-2" /> {/* Prevent the arrow from shrinking */}
          <span className="break-words flex-grow">{question}</span> {/* Allow the text to grow and wrap as needed */}
        </Button>
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
