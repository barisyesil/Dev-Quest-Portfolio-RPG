import React, { useState, useEffect } from 'react';
import './App.css';
import Game from './Game';
import PixelModal from './components/PixelModal';
import DialogueBox from './components/DialogueBox';
import GuestBook from './components/GuestBook';
import { api } from './services/api';
import SocialPanel from './components/SocialPanel';
import { audioManager } from './utils/AudioManager'; // Ses Yöneticisi eklendi

function App() {
  const [activeContent, setActiveContent] = useState(null);
  const [dynamicRegistry, setDynamicRegistry] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false); // Mute durumu

  // 1. Müzik Başlatma (Kullanıcı etkileşimi bekler)
  useEffect(() => {
    const startAudio = () => {
        // Audio Manager'ı başlat ve müziği çal
        audioManager.init();
        audioManager.playBGM();

        // Dinleyicileri temizle (Sadece bir kez çalışmalı)
        window.removeEventListener('keydown', startAudio);
        window.removeEventListener('click', startAudio);
    };

    window.addEventListener('keydown', startAudio);
    window.addEventListener('click', startAudio);
    
    return () => {
        window.removeEventListener('keydown', startAudio);
        window.removeEventListener('click', startAudio);
    };
  }, []);

  // 2. Veri Yükleme: Backend'den tüm portfolyo içeriğini çekiyoruz
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        let projects = [], achievements = [], dialogues = [];
        
        try {
            projects = await api.getItems('Project');
            achievements = await api.getItems('Achievement');
            dialogues = await api.getDialogues();
        } catch (apiError) {
            console.error("API Verisi Çekilemedi (Offline Mod olabilir):", apiError);
        }

        const registry = {
          project_desk_intro: { 
            type: 'modal', 
            data: { 
              title: "PROJECTS", 
              items: projects.map(p => ({ ...p, tags: p.tags ? p.tags.split(',') : [] })) 
            } 
          },
          achievements_list: { 
            type: 'modal', 
            data: { 
              title: "ACHIEVEMENTS", 
              items: achievements.map(a => ({ ...a, tags: a.tags ? a.tags.split(',') : [] })) 
            } 
          },
          guest_book_interaction: { type: 'guestbook' },
          social_portal: { type: 'social_portal' } 
        };

        dialogues.forEach(d => { 
          registry[d.key] = {  
            type: 'dialogue', 
            data: { text: d.text } 
          };
        });

        setDynamicRegistry(registry);
      } catch (error) {
        console.error("Genel hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  // 3. Etkileşim ve Klavye Yönetimi
  useEffect(() => {
    window.isUIOpen = activeContent !== null;

    const handleOpenInteraction = (event) => {
      if (window.isUIOpen) return; 

      const { contentKey, type, isStatic } = event.detail;
      console.log("Interaction Tetiklendi:", contentKey);

      // --- SES EFEKTLERİ ---
      // Genel etkileşim sesi
      audioManager.playSFX('interact');

      // Eğer InteractionManager'dan özel bir tip geldiyse
      if (type && isStatic) {
          // Portal ise özel portal sesi çal
          if (type === 'social_portal') {
              audioManager.playSFX('portal');
          }

          setActiveContent({ type, key: contentKey });
          return;
      }

      // Yoksa Registry'den bak
      const content = dynamicRegistry[contentKey]; 
      
      if (content) {
        setActiveContent({ ...content, key: contentKey });
      } else {
          console.warn(`Registry'de ${contentKey} bulunamadı!`);
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
    };

    window.addEventListener('openModal', handleOpenInteraction);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('openModal', handleOpenInteraction);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeContent, dynamicRegistry]); 

  // Ses Aç/Kapa Fonksiyonu
  const toggleAudio = () => {
      const mutedState = audioManager.toggleMute();
      setIsMuted(mutedState);
  };

  // Yükleme Ekranı
  if (loading) {
    return (
      <div className="app-main-container" style={{ justifyContent: 'center', display: 'flex' }}>
        <div className="loading-text" style={{ color: '#0f0', fontFamily: 'monospace' }}>
            INITIALIZING SYSTEM...
        </div>
      </div>
    );
  }

  return (
    <div className="app-main-container">
      <h1 className="game-title">DEVQUEST: PORTFOLIO RPG</h1>

      {/* SES KONTROL BUTONU (Sağ Üst) */}
      <button 
        onClick={toggleAudio}
        style={{
            position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '24px', filter: 'drop-shadow(2px 2px 0 #000)'
        }}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      {/* ARCADE MAKİNESİ ALANI */}
      <div className="arcade-wrapper">
        <img 
          src="/retro_arcade_image.png" 
          alt="Arcade Machine" 
          className="arcade-bg-img" 
        />

        <div className="game-screen" id="arcade-screen-container">
          <Game />

          {/* MODAL YÖNETİMİ */}
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
          
          {/* Social Portal Modalı */}
          {activeContent?.type === 'social_portal' && (
              <SocialPanel onClose={() => setActiveContent(null)} />
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