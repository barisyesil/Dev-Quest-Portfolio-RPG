import React, { useState, useEffect } from 'react';
import './App.css';
import Game from './Game';
import PixelModal from './components/PixelModal';
import DialogueBox from './components/DialogueBox';
import GuestBook from './components/GuestBook';
import { api } from './services/api';

function App() {
  const [activeContent, setActiveContent] = useState(null);
  const [dynamicRegistry, setDynamicRegistry] = useState({});
  const [loading, setLoading] = useState(true);

  // 1. Veri Yükleme: Backend'den tüm portfolyo içeriğini çekiyoruz
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const projects = await api.getItems('Project');
        const achievements = await api.getItems('Achievement');
        const dialogues = await api.getDialogues();

        // API'den gelen verileri bileşenlerin beklediği formata (Registry) dönüştür
        const registry = {
          // Projeler Listesi
          project_desk_intro: { 
            type: 'modal', 
            data: { 
              title: "PROJECTS", 
              items: projects.map(p => ({ ...p, tags: p.tags ? p.tags.split(',') : [] })) 
            } 
          },
          // Başarılar Listesi
          achievements_list: { 
            type: 'modal', 
            data: { 
              title: "ACHIEVEMENTS", 
              items: achievements.map(a => ({ ...a, tags: a.tags ? a.tags.split(',') : [] })) 
            } 
          },
          // Ziyaretçi Defteri (Statik tetikleyici)
          guest_book_interaction: { type: 'guestbook' }
        };


        // Dinamik Diyalogları (Easter Eggler, NPC'ler) Registry'e ekle
 
        dialogues.forEach(d => { 
          registry[d.key] = {  
            type: 'dialogue', 
            data: { text: d.text } 
          };
        });

        setDynamicRegistry(registry);
      } catch (error) {
        console.error("Backend bağlantı hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  // 2. Etkileşim ve Klavye Yönetimi
  useEffect(() => {
    window.isUIOpen = activeContent !== null;

    const handleOpenInteraction = (event) => {
      if (window.isUIOpen) return; 

      const key = event.detail.contentKey;
      const content = dynamicRegistry[key]; // Veriyi dinamik registry'den al
      
      if (content) {
        console.log("İçerik Açılıyor:", key);
        setActiveContent({ ...content, key: key });
      }
    };

    const handleKeyDown = (e) => {
      if (!activeContent) return;

      const isTyping = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      
      if (e.key === 'Escape') {
        setActiveContent(null);
        return;
      }

      if (isTyping) {
        e.stopPropagation();
        return;
      }

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
  }, [activeContent, dynamicRegistry]); // dynamicRegistry bağımlılığı önemli

  // Yükleme Ekranı (Retro Stil)
  if (loading) {
    return (
      <div className="app-main-container" style={{ justifyContent: 'center' }}>
        <div className="loading-text">LOADING DATABASE...</div>
      </div>
    );
  }

  return (
    <div className="app-main-container">
      <h1 className="game-title">DEVQUEST: PORTFOLIO RPG</h1>

      {/* ARCADE MAKİNESİ ALANI */}
      <div className="arcade-wrapper">
        {/* 1. Makine Görseli */}
        <img 
          src="/retro_arcade_image.png" 
          alt="Arcade Machine" 
          className="arcade-bg-img" 
        />

        {/* 2. Oyun Ekranı (Görselin içine oturacak) */}
        <div className="game-screen" id="arcade-screen-container">
          {/* Game bileşeni artık buraya render olacak */}
          <Game />

          {/* Modallar ve Diyaloglar da oyun ekranının içinde çıksın */}
          {activeContent?.type === 'modal' && (
            <PixelModal 
              contentKey={activeContent.key} 
              dataOverride={activeContent.data} 
              onClose={() => setActiveContent(null)} 
            />
          )}

          {activeContent?.type === 'dialogue' && (
            <DialogueBox 
              contentKey={activeContent.key} 
              dataOverride={activeContent.data} 
              onClose={() => setActiveContent(null)} 
            />
          )}
          
          {activeContent?.type === 'guestbook' && (
             <GuestBook onClose={() => setActiveContent(null)} />
          )}
        </div>
      </div>

      <div className="game-controls">
        USE ARROWS TO MOVE | PRESS [E] TO INTERACT
      </div>
    </div>
  );
}

export default App;