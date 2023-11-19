import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconArrowRight } from '@/components/ui/icons';
import { questions } from '@/lib/constants'; // Ensure the path is correct
import styles from './ChatListContainer.module.css'; // Adjust the path if necessary
import styles_questions_overlay from './QuestionsOverlay.module.css'; // Import the CSS module

interface QuestionListProps {
    setInput: (input: string) => void;
  }
  
export const QuestionList: React.FC<QuestionListProps> = ({ setInput }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  // Wrap shuffleQuestions with useCallback to prevent it from being recreated on every render
  const shuffleQuestions = useCallback(() => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, 4));
  }, []);

  // Use the shuffleQuestions function on component mount and when shuffleQuestions changes
  useEffect(() => {
    shuffleQuestions();
  }, [shuffleQuestions]);

  return (
    <div>
        <Button
          variant="outline"
          className={styles_questions_overlay.shuffleButton}
          onClick={shuffleQuestions}
        >
          Shuffle Questions
        </Button>
      
      {selectedQuestions.map((question, index) => (
        <div key={index} className={styles.questionBox}>
          <Button
            variant="link"
            className={styles.question}
            onClick={() => setInput(question)}
          >
            <IconArrowRight className="flex-shrink-0 mr-2" />
            {question}
          </Button>
        </div>
      ))}
    </div>
  );
};