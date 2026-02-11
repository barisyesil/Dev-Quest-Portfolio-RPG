import React from 'react';

const SocialPanel = ({ onClose }) => {
  // LİNKLERİNİ BURAYA GİR
  const socialLinks = [
    { 
      id: 'linkedin', 
      label: 'LinkedIn', 
      url: 'https://www.linkedin.com/in/baris-yesildag', 
      icon: '/assets/icons/linkedin.png', 
      color: '#0077b5' 
    },
    { 
      id: 'github', 
      label: 'GitHub', 
      url: 'https://github.com/barisyesil', 
      icon: '/assets/icons/github.png', 
      color: '#333' 
    },
    { 
      id: 'kaggle', 
      label: 'Kaggle', 
      url: 'https://www.kaggle.com/baryeilda', 
      icon: '/assets/icons/kaggle.png', 
      color: '#20beff' 
    },
    
    
    
    { id: 'cv', label: 'Resume', url: '/assets/cv.pdf', icon: '/assets/icons/pdf.png', color: '#4caf50' }
  ];

  return (
    <div style={styles.overlay}>
      {/* Animasyon Keyframe'leri */}
      <style>
        {`
          @keyframes portalSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes portalPulse {
            0% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.02); }
            100% { opacity: 0.8; transform: scale(1); }
          }
          .social-card:hover {
            transform: scale(1.05);
            background: rgba(0, 0, 0, 0.6) !important;
            border-color: #ffaa00 !important;
          }
        `}
      </style>

      {/* --- PORTAL ÇERÇEVESİ (OBSIDIAN) --- */}
      <div style={styles.obsidianFrame}>
        
        {/* --- DÖNEN SPİRAL ARKA PLAN --- */}
        <div style={styles.portalVortex}></div>
        
        {/* --- İÇERİK KATMANI --- */}
        <div style={styles.contentContainer}>
          
          <div style={styles.header}>
            <h2 style={styles.title}>NETHER GATEWAY</h2>
            <button onClick={onClose} style={styles.closeBtn}>X</button>
          </div>

          <div style={styles.grid}>
            {socialLinks.map((link) => (
              <a 
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-card"
                style={styles.card}
              >
                {/* İkon */}
                <div style={{...styles.iconBox, borderColor: link.color}}>
                  <img 
                    src={link.icon} 
                    alt={link.label} 
                    style={styles.iconImg}
                    onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='block'}} 
                  />
                  {/* Resim yoksa baş harf */}
                  <span style={{display: 'none', color: '#fff', fontSize: '24px', fontWeight: 'bold'}}>
                    {link.label[0]}
                  </span>
                </div>
                <span style={styles.label}>{link.label}</span>
              </a>
            ))}
          </div>
          
          <p style={styles.footer}>WARNING: ENTERING EXTERNAL REALM</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 3000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(4px)'
  },
  
  // OBSIDIAN ÇERÇEVE
  obsidianFrame: {
    position: 'relative',
    width: '380px', // Sabit Genişlik
    minHeight: '400px', // İçeriğe göre uzar
    padding: '40px', // Çerçeve kalınlığı gibi davranacak
    backgroundColor: '#140c1c', // Koyu Obsidian Rengi
    boxShadow: '0 0 0 4px #2a0d2e, 0 0 30px #9000cc', // Katmanlı blok görünümü ve Mor Parıltı
    borderRadius: '8px', // Hafif yumuşak köşeler (Minecraft blokları gibi)
    overflow: 'hidden', // Spiral dışarı taşmasın
    display: 'flex', flexDirection: 'column'
  },

  // DÖNEN ARKA PLAN (VORTEX)
  portalVortex: {
    position: 'absolute',
    top: '-50%', left: '-50%', width: '200%', height: '200%',
    background: 'conic-gradient(from 0deg, #30004a, #58008a, #8f00e0, #58008a, #30004a)',
    animation: 'portalSpin 10s linear infinite', // Yavaşça dönen spiral
    opacity: 0.6,
    zIndex: 0,
    pointerEvents: 'none'
  },

  // İÇERİK KUTUSU
  contentContainer: {
    position: 'relative', zIndex: 1, // Arka planın üstünde
    backgroundColor: 'rgba(20, 10, 30, 0.85)', // Okunabilirlik için yarı saydam siyah/mor zemin
    height: '100%', width: '100%',
    borderRadius: '2px',
    padding: '20px',
    boxSizing: 'border-box',
    border: '2px solid #52007a', // İç çerçeve
    display: 'flex', flexDirection: 'column', gap: '20px'
  },

  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderBottom: '2px dashed #9000cc', paddingBottom: '10px'
  },
  title: { 
    color: '#dfa8ff', fontFamily: "'Press Start 2P', cursive", fontSize: '12px',
    textShadow: '2px 2px 0 #000' 
  },
  closeBtn: {
    background: '#30004a', border: '2px solid #ff5555', color: '#fff',
    fontFamily: "'Press Start 2P', cursive", cursor: 'pointer', padding: '5px 8px',
    fontSize: '10px'
  },
  
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px'
  },

  // KARTLAR
  card: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    textDecoration: 'none', padding: '15px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    border: '2px solid #58008a', 
    transition: 'all 0.2s ease', cursor: 'pointer'
  },
  iconBox: {
    width: '48px', height: '48px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '10px',
    //border: '2px solid transparent', // Hoverda rengi değişsin diye
    borderRadius: '4px'
  },
  iconImg: { width: '64px', height: '64px', imageRendering: 'pixelated', filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))' },
  label: { 
    color: '#fff', fontFamily: "'Press Start 2P', cursive", fontSize: '8px', 
    textAlign: 'center', textShadow: '1px 1px 0 #000' 
  },

  footer: {
    fontSize: '7px', color: '#dfa8ff', textAlign: 'center', marginTop: 'auto',
    fontFamily: "'Press Start 2P', cursive", opacity: 0.7
  }
};

export default SocialPanel;