import React, { useState, useEffect, useRef } from 'react';
import { dataMap } from '../data/dataRegistry';

const DialogueBox = ({ contentKey, onClose, dataOverride }) => {
  const [displayText, setDisplayText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  
  // ÖNCELİK: Canlı veri -> Statik veri -> Varsayılan metin
  const textSource = dataOverride || (dataMap[contentKey] ? dataMap[contentKey].data : null);
  const fullText = textSource?.text || "No text data found...";

  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayText('');
    setIsFinished(false);

    const timer = setInterval(() => {
      indexRef.current += 1;
      const currentSlice = fullText.slice(0, indexRef.current);
      setDisplayText(currentSlice);

      if (indexRef.current >= fullText.length) {
        clearInterval(timer);
        setIsFinished(true);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [fullText]);

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.text}>{displayText}</div>
        
        {isFinished && (
          <div style={styles.arrowContainer}>
            <span style={styles.arrowAnim}>▼</span> [SPACE]
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute',
    bottom: '40px', // Oyun kutusunun alt kısmına yakın
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%', // Genişlik
    zIndex: 2000,
  },
  box: {
    backgroundColor: '#000', // Retro siyah arka plan
    border: '4px solid #fff', // Kalın beyaz çerçeve
    padding: '20px',
    minHeight: '100px', // Minimum yükseklik
    boxShadow: '8px 8px 0px #333', // Piksel gölge efekti
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  text: {
    color: '#fff',
    fontFamily: "'Press Start 2P', cursive", // Piksel font
    fontSize: '12px', // Okunabilir boyut
    lineHeight: '1.8', // Satır aralığı
    textTransform: 'uppercase', // Retro oyunlar genelde büyük harf kullanır
    whiteSpace: 'pre-wrap' // Satır sonlarını korur
  },
  arrowContainer: {
    marginTop: '10px',
    alignSelf: 'flex-end',
    color: '#f1c40f', // Altın sarısı renk
    fontSize: '10px',
    fontFamily: "'Press Start 2P', cursive",
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  // Basit bir yanıp sönme efekti için inline style hilesi
  arrowAnim: {
    animation: 'blink 1s step-end infinite'
  }
};

// CSS animasyonunu global bir style tag'i ile ekleyelim ki jsx içinde çalışsın
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}`;
document.head.appendChild(styleSheet);

export default DialogueBox;