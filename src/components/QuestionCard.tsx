import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, ChevronRight } from 'lucide-react';

interface QuestionCardProps {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  onSkip: () => void;
}

const QuestionCard = ({ question, questionNumber, totalQuestions, onAnswer, onSkip }: QuestionCardProps) => {
  const [answer, setAnswer] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 600);
  }, [question]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onAnswer(answer.trim());
      setAnswer('');
    }
  };

  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{
        width: '100%',
        maxWidth: '600px',
        padding: '0 20px'
      }}
    >
      <motion.div
        style={{
          marginBottom: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px',
          color: '#7a7a7a',
          fontFamily: "'Noto Sans SC', sans-serif"
        }}>
          <span>问题 {questionNumber} / {totalQuestions}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress-container">
          <motion.div 
            className="progress-bar"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      <motion.div
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          padding: '40px 32px',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 8px 40px rgba(255, 105, 180, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            opacity: 0.3
          }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart size={32} color="#ff69b4" fill="#ff69b4" />
        </motion.div>

        <motion.div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffb6c1, #ff69b4)',
            color: 'white',
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: "'Noto Sans SC', sans-serif",
            marginBottom: '24px'
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          {questionNumber}
        </motion.div>

        <motion.h3
          style={{
            fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
            fontFamily: "'Noto Serif SC', serif",
            color: '#4a4a4a',
            fontWeight: 500,
            lineHeight: 1.5,
            marginBottom: '32px',
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {question}
        </motion.h3>

        <form onSubmit={handleSubmit}>
          <motion.div
            style={{ position: 'relative', marginBottom: '24px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <input
              ref={inputRef}
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="写下你的回答..."
              className="glass-input"
              style={{
                paddingRight: '60px',
                fontSize: '16px',
                minHeight: '60px'
              }}
            />
            
            <motion.button
              type="submit"
              disabled={!answer.trim()}
              whileHover={{ scale: answer.trim() ? 1.1 : 1 }}
              whileTap={{ scale: answer.trim() ? 0.9 : 1 }}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: 'none',
                background: answer.trim() 
                  ? 'linear-gradient(135deg, #ff69b4, #db7093)' 
                  : 'rgba(200, 200, 200, 0.5)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: answer.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                boxShadow: answer.trim() 
                  ? '0 4px 15px rgba(255, 105, 180, 0.4)' 
                  : 'none'
              }}
            >
              <Send size={20} />
            </motion.button>
          </motion.div>

          <motion.div
            style={{ display: 'flex', justifyContent: 'center' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <button
              type="button"
              onClick={onSkip}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#aaa',
                fontSize: '14px',
                fontFamily: "'Noto Sans SC', sans-serif",
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ff69b4'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#aaa'}
            >
              跳过这个问题
              <ChevronRight size={16} />
            </button>
          </motion.div>
        </form>

        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '30px',
                border: '2px solid rgba(255, 105, 180, 0.3)',
                pointerEvents: 'none'
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {answer.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{
              position: 'fixed',
              bottom: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px'
            }}
          >
            {[...Array(Math.min(answer.length % 5 + 1, 3))].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
              >
                <Heart size={16} color="#ffb6c1" fill="#ffb6c1" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionCard;
