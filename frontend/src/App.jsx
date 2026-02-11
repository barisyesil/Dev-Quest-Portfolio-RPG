import React, { useState, useEffect } from 'react';
import './App.css';
import Game from './Game';
import PixelModal from './components/PixelModal';
import DialogueBox from './components/DialogueBox';
import GuestBook from './components/GuestBook';
import { api } from './services/api';
import SocialPanel from './components/SocialPanel';

function App() {
  const [activeContent, setActiveContent] = useState(null);
  const [dynamicRegistry, setDynamicRegistry] = useState({});
  const [loading, setLoading] = useState(true);

  // 1. Veri Yükleme: Backend'den tüm portfolyo içeriğini çekiyoruz
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        // Hataları yakalamak için try-catch bloğu içinde kalmalı
        let projects = [], achievements = [], dialogues = [];
        
        try {
            projects = await api.getItems('Project');
            achievements = await api.getItems('Achievement');
            dialogues = await api.getDialogues();
        } catch (apiError) {
            console.error("API Verisi Çekilemedi (Offline Mod olabilir):", apiError);
            // API hatası olsa bile oyunun açılması için boş array devam et
        }

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
          guest_book_interaction: { type: 'guestbook' },
          
          // --- EKLENEN KISIM: Social Portal Registry Kaydı ---
          social_portal: { type: 'social_portal' } 
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
        console.error("Genel hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  // 2. Etkileşim ve Klavye Yönetimi
  useEffect(() => {
    // UI açık mı kontrolü (window objesine atıyoruz ki Phaser erişebilsin)
    window.isUIOpen = activeContent !== null;

    const handleOpenInteraction = (event) => {
      if (window.isUIOpen) return; 

      const { contentKey, type, isStatic } = event.detail;

      console.log("Interaction Tetiklendi:", contentKey); // Debug log

      // Eğer InteractionManager'dan özel bir tip geldiyse (örn: social_portal)
      if (type && isStatic) {
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

      // Input alanlarına yazı yazarken modal kapanmasın
      const isTyping = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      
      if (e.key === 'Escape') {
        setActiveContent(null);
        return;
      }

      if (isTyping) {
        // Space tuşu formlarda boşluk bırakmalı, modalı kapatmamalı
        e.stopPropagation(); 
        return;
      }

      // Sadece 'Escape' veya etkileşim tuşu dışında bir tuşla kapatmak istersen burayı düzenle
      // Şimdilik 'E' veya 'Space' ile de kapatma özelliği açık kalsın mı?
      // Kullanıcı deneyimi için genelde 'Escape' veya 'X' butonu yeterlidir.
      // E tuşuna basınca kapanması bazen input yazarken karışıklık yaratabilir (yukarıda engelledik gerçi).
    };

    window.addEventListener('openModal', handleOpenInteraction);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('openModal', handleOpenInteraction);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeContent, dynamicRegistry]); 

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