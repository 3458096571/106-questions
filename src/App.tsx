import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ParticleBackground from './components/ParticleBackground';
import IntroAnimation from './components/IntroAnimation';
import QuestionCard from './components/QuestionCard';
import ResultView from './components/ResultView';
import { questions } from './questions';

type AppPhase = 'intro' | 'questions' | 'result';

function App() {
  const [phase, setPhase] = useState<AppPhase>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleIntroComplete = useCallback(() => {
    setPhase('questions');
  }, []);

  const handleAnswer = useCallback((answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setPhase('result');
    }
  }, [currentQuestionIndex]);

  const handleSkip = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setPhase('result');
    }
  }, [currentQuestionIndex]);

  const handleRestart = useCallback(() => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setPhase('intro');
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <ParticleBackground />

      <div style={{
        position: 'relative',
        zIndex: 5,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%', height: '100%' }}
            >
              <IntroAnimation onComplete={handleIntroComplete} />
            </motion.div>
          )}

          {phase === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
            >
              <QuestionCard
                key={currentQuestionIndex}
                question={questions[currentQuestionIndex]}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                onAnswer={handleAnswer}
                onSkip={handleSkip}
              />
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%', height: '100%', overflowY: 'auto' }}
            >
              <ResultView answers={answers} onRestart={handleRestart} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          fontSize: '12px',
          color: 'rgba(150, 150, 150, 0.6)',
          fontFamily: "'Noto Sans SC', sans-serif",
          textAlign: 'center'
        }}
      >
        <a 
          href="https://github.com/3458096571/106-questions" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: 'rgba(255, 105, 180, 0.6)',
            textDecoration: 'none',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ff69b4'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 105, 180, 0.6)'}
        >
          Made with ♡
        </a>
      </motion.div>
    </div>
  );
}

export default App;
