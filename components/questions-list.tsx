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
    const pickedQuestions = new Set<string>(); // Specify Set type as string
    while (pickedQuestions.size < 4) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      pickedQuestions.add(questions[randomIndex]);
    }
    setSelectedQuestions(Array.from(pickedQuestions));
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
