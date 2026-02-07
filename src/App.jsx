import React, { useState, useEffect } from 'react';
import './App.css';
import Game from './Game';
import PixelModal from './components/PixelModal';
import DialogueBox from './components/DialogueBox'; // Yeni bileşen
import { dataMap } from './data/dataRegistry'; // Veri dağıtıcı
import GuestBook from './components/GuestBook'; // Yeni bileşen

function App() {
  const [activeContent, setActiveContent] = useState(null);

  useEffect(() => {
    // UI durumunu global olarak işaretle (Phaser'ın görmesi için)
    window.isUIOpen = activeContent !== null;

    const handleOpenInteraction = (event) => {
      // Eğer zaten bir UI açıksa yeni bir etkileşimi tetikleme
      if (window.isUIOpen) return; 

      const key = event.detail.contentKey;
      const content = dataMap[key];
      if (content) {
        setActiveContent({ ...content, key: key });
      }
    };

    const handleKeyDown = (e) => {
      if (!activeContent) return;

      // ESC her zaman kapatır
      if (e.key === 'Escape') {
        setActiveContent(null);
        return;
      }

      // GuestBook (Form) açıkken E ve Space yazı yazmak içindir, kapatmak için değil!
      if (activeContent.type === 'guestbook') {
        return; // Sadece ESC ile kapanabilir
      }

      // DialogueBox veya Modal ise Space ve E ile de kapanabilir/geçilebilir
      if (e.key === ' ' || e.key.toLowerCase() === 'e') {
        setActiveContent(null);
      }
    };

    window.addEventListener('openModal', handleOpenInteraction);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('openModal', handleOpenInteraction);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeContent]);

  return (
    <div className="app-main-container">
      <h1 className="game-title">DEVQUEST: PORTFOLIO RPG</h1>

      <div className="game-wrapper">
        <Game />
        
        {/* Koşullu Render: Gelen tip 'modal' ise (Projeler/Başarılar) */}
        {activeContent?.type === 'modal' && (
          <PixelModal 
            contentKey={activeContent.key} 
            onClose={() => setActiveContent(null)} 
          />
        )}

        {/* Koşullu Render: Gelen tip 'dialogue' ise (Easter Egg/NPC) */}
        {activeContent?.type === 'dialogue' && (
          <DialogueBox 
            contentKey={activeContent.key} 
            onClose={() => setActiveContent(null)} 
          />
        )}
        
          {activeContent?.type === 'guestbook' && (
          <GuestBook onClose={() => setActiveContent(null)} />
         )}
      </div>

      <div className="game-controls">
        USE ARROWS TO MOVE | PRESS [E] TO INTERACT
      </div>
    </div>
  );
}

export default App;