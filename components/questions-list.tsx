import { useCallback, useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { questions } from '@/lib/constants'; // Ensure the path is correct
import styles from './QuestionsOverlay.module.css'; // Import the CSS module

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

  const pickRandomQuestions = useCallback(() => {
    // Create an array of indices [0, 1, 2, ..., questions.length - 1]
    const indices = Array.from({ length: questions.length }, (_, i) => i);
  
    // Shuffle the indices array
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  
    // Pick the first four indices
    const selectedIndices = indices.slice(0, 4);
  
    // Get the questions corresponding to the selected indices
    const selectedQuestions = selectedIndices.map(index => questions[index]);
  
    setSelectedQuestions(selectedQuestions);
  }, [questions]);
  
  useEffect(() => {
    pickRandomQuestions();
  }, [pickRandomQuestions]);

  return (
    <div>
      <Button
        variant="outline"
        className={styles.shuffleButton}
        onClick={pickRandomQuestions}
      >
        Shuffle Questions
      </Button>

      {selectedQuestions.map((question, index) => (
        <div 
          key={index} 
          className={styles.questionBox}
        >
          <Button
            variant="link"
            className={styles.question}
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
