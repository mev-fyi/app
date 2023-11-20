import { useCallback, useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { questions } from '@/lib/constants'; // Ensure the path is correct
import styles_questions_overlay from './QuestionsOverlay.module.css'; // Import the CSS module

interface QuestionListProps {
    setInput: (input: string) => void;
  }
  
export const QuestionList: React.FC<QuestionListProps> = ({ setInput }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const questionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (questionRefs.current.length === selectedQuestions.length) {
      questionRefs.current.forEach(box => {
        if (box) {
          const questionText = box.innerText;
          let fontSize;
  
          if (questionText.length <= 50) {
            fontSize = '1rem';
          } else if (questionText.length <= 100) {
            fontSize = '0.95rem';
          } else {
            fontSize = '0.9rem';
          }
  
          box.style.fontSize = fontSize;
        }
      });
    }
  }, [selectedQuestions]);

  const shuffleQuestions = useCallback(() => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, 4));
  }, []);

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
        <div 
          key={index} 
          className={styles_questions_overlay.questionBox}
        >
          <Button
            variant="link"
            className={styles_questions_overlay.question}
            onClick={() => setInput(question)}
            ref={el => questionRefs.current[index] = el} // Assign ref to the button
          >
            {question}
          </Button>
        </div>
      ))}
    </div>
  );
};
