import { useCallback, useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { questions } from '@/lib/constants'; // Ensure the path is correct
import styles_questions_overlay from './QuestionsOverlay.module.css'; // Import the CSS module

interface QuestionListProps {
    setInput: (input: string) => void;
  }


  
export const QuestionList: React.FC<QuestionListProps> = ({ setInput }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const adjustFontSize = () => {
  questionRefs.current.forEach(box => {
      if (box) { // Check if box is not null
      const questionText = box.innerText;
      let fontSize;
  
      if (questionText.length <= 50) {
          fontSize = '1rem';
      } else if (questionText.length <= 100) {
          fontSize = '0.75rem';
      } else {
          fontSize = '0.65rem';
      }
  
      box.style.fontSize = fontSize;
      }
  });
  };
  
  // Wrap shuffleQuestions with useCallback to prevent it from being recreated on every render
  const shuffleQuestions = useCallback(() => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, 4));
    // Reset refs
    questionRefs.current = [];
  }, []);

  // Use the shuffleQuestions function on component mount and when shuffleQuestions changes
  useEffect(() => {
    shuffleQuestions();
  }, [shuffleQuestions]);

  useEffect(() => {
    adjustFontSize();
  }, [selectedQuestions]);

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
            ref={el => questionRefs.current[index] = el} // Assign ref
        >
          <Button
            variant="link"
            className={styles_questions_overlay.question}
            onClick={() => setInput(question)}
          >
            {question}
          </Button>
        </div>
      ))}
    </div>
  );
};