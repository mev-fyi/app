import { useCallback, useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { questions } from '@/lib/constants'; // Ensure the path is correct
import styles from './QuestionsOverlay.module.css'; // Import the CSS module

interface QuestionListProps {
    setInput: (input: string) => void;
  }
  
export const QuestionListLeftPanel: React.FC<QuestionListProps> = ({ setInput }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Set the initial value
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const questionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Your existing useEffect with added mobile logic
  useEffect(() => {
    if (questionRefs.current.length === selectedQuestions.length) {
      questionRefs.current.forEach(box => {
        if (box) {
          const questionText = box.innerText;
          let fontSize;
          
          // Adjust font sizes based on isMobile state
          if (isMobile) {
            if (questionText.length <= 50) {
              fontSize = '1rem'; // Smaller font size for mobile
            } else if (questionText.length <= 100) {
              fontSize = '0.9rem';
            } else if (questionText.length <= 150) {
              fontSize = '0.8rem';
            } else {
              fontSize = '0.7rem';
            }
          } else {
            // Desktop sizes
            if (questionText.length <= 50) {
              fontSize = '1.35rem';
            } else if (questionText.length <= 100) {
              fontSize = '1.25rem';
            } else if (questionText.length <= 150) {
              fontSize = '1.1rem';
            } else {
              fontSize = '1rem';
            }
          }

          box.style.fontSize = fontSize;
        }
      });
    }
  }, [selectedQuestions, isMobile]); // Include isMobile in dependency array

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
    <div className={styles.questionsContainer}>
      <Button
        variant="outline"
        className={styles.shuffleButton}
        onClick={pickRandomQuestions}
      >
        Shuffle Questions
      </Button>

      <div className={styles.questionsOverlayLeftPanel}>
        {selectedQuestions.map((question, index) => (
          <div key={index} className={styles.questionBoxLeftPanel}>
            <Button
              variant="link"
              className={styles.question}
              onClick={() => setInput(question)}
              ref={el => questionRefs.current[index] = el}
            >
              {question}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
