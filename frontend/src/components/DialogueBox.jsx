import React, { useState, useEffect, useRef } from 'react';
import { audioManager } from '../utils/AudioManager';

// contentKey prop'una artık ihtiyacımız yok, sadece veriyi (dataOverride) alıyoruz.
const DialogueBox = ({ dataOverride }) => {
  const [displayText, setDisplayText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  
  const indexRef = useRef(0);

  // Sadece App.jsx'ten gelen veriyi kullan
  const fullText = dataOverride?.text || "No text data found...";

  useEffect(() => {
    let typeInterval;

    // State güncellemelerini asenkron hale getirerek ESLint hatasını önlüyoruz
    const startTimeout = setTimeout(() => {
        // Başlangıç durumunu sıfırla
        indexRef.current = 0;
        setDisplayText('');
        setIsFinished(false);

        // Yazı yazma döngüsü
        typeInterval = setInterval(() => {
            indexRef.current += 1;
            
            // Metni dilimleyerek göster
            const currentSlice = fullText.slice(0, indexRef.current);
            setDisplayText(currentSlice);

            // Ses Efekti: Her 3 harfte bir çalsın (Kulak tırmalamasın diye)
            if (indexRef.current % 3 === 0) {
                audioManager.playSFX('type');
            }

            // Bitiş Kontrolü
            if (indexRef.current >= fullText.length) {
                clearInterval(typeInterval);
                setIsFinished(true);
            }
        }, 30); // Yazı hızı (30ms idealdir)
    }, 0);

    // Cleanup: Bileşen kapanırsa timer'ları temizle
    return () => {
        clearTimeout(startTimeout);
        if (typeInterval) clearInterval(typeInterval);
    };
  }, [fullText]);

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.text}>{displayText}</div>
        
        {isFinished && (
          <div style={styles.arrowContainer}>
            <span style={styles.arrowAnim}>▼</span> [ ESC ] TO CLOSE
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

// CSS animasyonunu global olarak ekliyoruz (Burası kalabilir)
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