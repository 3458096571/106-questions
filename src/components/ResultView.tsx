import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Heart, Sparkles, Copy, Check } from 'lucide-react';
import { questions } from '../questions';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ResultViewProps {
  answers: Record<number, string>;
  onRestart: () => void;
}

const ResultView = ({ answers, onRestart }: ResultViewProps) => {
  const [copied, setCopied] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;

  const generateShareText = () => {
    let text = `💕 想了解你的106个问题 💕\n\n`;
    text += `已回答 ${answeredCount}/${totalQuestions} 个问题\n\n`;
    
    Object.entries(answers).forEach(([index, answer]) => {
      const qIndex = parseInt(index);
      text += `Q${qIndex + 1}. ${questions[qIndex]}\n`;
      text += `A: ${answer}\n\n`;
    });
    
    text += `—— 来自 想了解你的106个问题`;
    return text;
  };

  const handleShare = async () => {
    const text = generateShareText();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '想了解你的106个问题',
          text: text
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadImage = async () => {
    if (!documentRef.current) return;
    
    const canvas = await html2canvas(documentRef.current, {
      backgroundColor: '#fff0f5',
      scale: 2
    });
    
    const link = document.createElement('a');
    link.download = '想了解你的106个问题.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(24);
    doc.setTextColor(255, 105, 180);
    doc.text('想了解你的106个问题', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`已回答 ${answeredCount}/${totalQuestions} 个问题`, 105, 30, { align: 'center' });
    
    let y = 45;
    
    Object.entries(answers).forEach(([index, answer], i) => {
      const qIndex = parseInt(index);
      
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(11);
      doc.setTextColor(255, 105, 180);
      doc.text(`${i + 1}. ${questions[qIndex]}`, 20, y);
      y += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const splitAnswer = doc.splitTextToSize(answer, 170);
      doc.text(splitAnswer, 25, y);
      y += splitAnswer.length * 5 + 10;
    });
    
    doc.save('想了解你的106个问题.pdf');
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ marginBottom: '16px' }}
        >
          <Heart size={48} color="#ff69b4" fill="#ff69b4" />
        </motion.div>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
          fontFamily: "'Noto Serif SC', serif",
          background: 'linear-gradient(135deg, #ff69b4, #db7093)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '8px'
        }}>
          回答完成！
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#7a7a7a',
          fontFamily: "'Noto Sans SC', sans-serif"
        }}>
          你回答了 {answeredCount} 个问题
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '40px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        <motion.button
          className="glass-button"
          onClick={handleShare}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {copied ? <Check size={18} /> : <Share2 size={18} />}
          {copied ? '已复制' : '分享'}
        </motion.button>
        
        <motion.button
          className="glass-button"
          onClick={handleDownloadImage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.8), rgba(219, 112, 147, 0.8))'
          }}
        >
          <Download size={18} />
          保存图片
        </motion.button>
        
        <motion.button
          className="glass-button"
          onClick={handleDownloadPDF}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, rgba(255, 192, 203, 0.8), rgba(255, 105, 180, 0.8))'
          }}
        >
          <Copy size={18} />
          导出PDF
        </motion.button>
      </motion.div>

      <motion.div
        ref={documentRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: '600px',
          background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e1 100%)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 8px 40px rgba(255, 105, 180, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.6)'
        }}
      >
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: '2px dashed rgba(255, 105, 180, 0.3)'
        }}>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ marginBottom: '12px' }}
          >
            <Sparkles size={32} color="#ff69b4" />
          </motion.div>
          <h2 style={{
            fontSize: '24px',
            fontFamily: "'Noto Serif SC', serif",
            color: '#ff69b4',
            marginBottom: '8px'
          }}>
            想了解你的106个问题
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#999',
            fontFamily: "'Noto Sans SC', sans-serif"
          }}>
            {new Date().toLocaleDateString('zh-CN')} · {answeredCount} 个回答
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {Object.entries(answers).map(([index, answer], i) => {
            const qIndex = parseInt(index);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.4 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.5)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ffb6c1, #ff69b4)',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 600,
                    fontFamily: "'Noto Sans SC', sans-serif"
                  }}>
                    {i + 1}
                  </span>
                  <p style={{
                    fontSize: '15px',
                    fontFamily: "'Noto Sans SC', sans-serif",
                    color: '#4a4a4a',
                    fontWeight: 500,
                    lineHeight: 1.5,
                    flex: 1
                  }}>
                    {questions[qIndex]}
                  </p>
                </div>
                <div style={{ paddingLeft: '40px' }}>
                  <p style={{
                    fontSize: '14px',
                    fontFamily: "'Noto Sans SC', sans-serif",
                    color: '#ff69b4',
                    lineHeight: 1.6,
                    fontStyle: 'italic'
                  }}>
                    {answer}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '2px dashed rgba(255, 105, 180, 0.3)'
        }}>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart size={24} color="#ffb6c1" fill="#ffb6c1" />
          </motion.div>
        </div>
      </motion.div>

      <motion.button
        onClick={onRestart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          marginTop: '40px',
          background: 'transparent',
          border: '2px solid rgba(255, 105, 180, 0.5)',
          borderRadius: '25px',
          padding: '12px 32px',
          color: '#ff69b4',
          fontSize: '16px',
          fontFamily: "'Noto Sans SC', sans-serif",
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        重新开始
      </motion.button>
    </div>
  );
};

export default ResultView;
