import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questions } from '../questions';
import { Heart } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [phase, setPhase] = useState<'title' | 'flash' | 'ready'>('title');
  const [visibleQuestions, setVisibleQuestions] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase === 'title') {
      const timer = setTimeout(() => {
        setPhase('flash');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'flash') return;

    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 30);
    let index = 0;

    const interval = setInterval(() => {
      if (index >= shuffled.length) {
        clearInterval(interval);
        setTimeout(() => setPhase('ready'), 500);
        return;
      }

      const container = containerRef.current;
      if (container) {
        const x = Math.random() * (container.clientWidth - 200) + 100;
        const y = Math.random() * (container.clientHeight - 100) + 50;
        
        const newQuestion = {
          id: Date.now() + index,
          text: shuffled[index],
          x,
          y
        };

        setVisibleQuestions(prev => [...prev.slice(-5), newQuestion]);
        index++;
      }
    }, 150);

    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
      }}
    >
      <AnimatePresence mode="wait">
        {phase === 'title' && (
          <motion.div
            key="title"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px'
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart size={64} color="#ff69b4" fill="#ff69b4" />
            </motion.div>
            <motion.h1
              style={{
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                fontFamily: "'Noto Serif SC', serif",
                background: 'linear-gradient(135deg, #ff69b4, #db7093, #ff1493)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}
            >
              想了解你的
            </motion.h1>
            <motion.div
              style={{
                fontSize: 'clamp(4rem, 12vw, 8rem)',
                fontFamily: "'Noto Serif SC', serif",
                background: 'linear-gradient(135deg, #ff1493, #ff69b4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700,
                lineHeight: 1
              }}
            >
              106
            </motion.div>
            <motion.p
              style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: '#db7093',
                fontFamily: "'Noto Sans SC', sans-serif",
                fontWeight: 300
              }}
            >
              个问题
            </motion.p>
          </motion.div>
        )}

        {phase === 'flash' && (
          <motion.div
            key="flash"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              overflow: 'hidden'
            }}
          >
            <AnimatePresence>
              {visibleQuestions.map((q, i) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.2, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    left: q.x,
                    top: q.y,
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 24px',
                    borderRadius: '20px',
                    boxShadow: '0 4px 20px rgba(255, 105, 180, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    fontSize: '14px',
                    color: '#4a4a4a',
                    fontFamily: "'Noto Sans SC', sans-serif",
                    whiteSpace: 'nowrap',
                    zIndex: visibleQuestions.length - i
                  }}
                >
                  {q.text}
                </motion.div>
              ))}
            </AnimatePresence>
            
            <motion.div
              style={{
                position: 'absolute',
                bottom: '15%',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <motion.div
                style={{
                  width: '200px',
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}
              >
                <motion.div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #ffb6c1, #ff69b4)',
                    borderRadius: '2px'
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4.5, ease: 'linear' }}
                />
              </motion.div>
              <motion.p
                style={{
                  fontSize: '14px',
                  color: '#db7093',
                  fontFamily: "'Noto Sans SC', sans-serif"
                }}
              >
                正在加载问题...
              </motion.p>
            </motion.div>
          </motion.div>
        )}

        {phase === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '32px'
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart size={80} color="#ff69b4" fill="#ff69b4" />
            </motion.div>
            <motion.h2
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontFamily: "'Noto Serif SC', serif",
                color: '#4a4a4a',
                fontWeight: 600
              }}
            >
              准备好回答了吗？
            </motion.h2>
            <motion.p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: '#7a7a7a',
                fontFamily: "'Noto Sans SC', sans-serif",
                maxWidth: '400px',
                lineHeight: 1.6
              }}
            >
              106个问题，106个了解彼此的机会<br />
              用心回答，真诚分享
            </motion.p>
            <motion.button
              className="glass-button"
              onClick={onComplete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                marginTop: '20px',
                fontSize: '18px',
                padding: '16px 48px'
              }}
            >
              开始回答 ♡
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntroAnimation;
