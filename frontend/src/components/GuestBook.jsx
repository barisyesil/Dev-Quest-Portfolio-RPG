import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const GuestBook = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('read');
  const [entries, setEntries] = useState([]); // Başlangıç boş dizi
  const [formData, setFormData] = useState({ author: '', message: '' });

  // Açılış animasyonu ve VERİ ÇEKME


  const loadEntries = async () => {
    try {
      const data = await api.getGuestBook();
      setEntries(data);
    } catch (err) {
      console.error("Entries yüklenemedi:", err);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 10);
    loadEntries();           // Bileşen açıldığında verileri yükle
    return () => clearTimeout(timer);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.author || !formData.message) return;

    await api.postGuestBookEntry({
      author: formData.author,
      message: formData.message
    });

    setFormData({ author: '', message: '' });
    await loadEntries(); 
    setView('read');
  };

  // Tarih ve Saat Formatlayıcı (Örn: 08.02.2026 14:30)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={{
        ...styles.bookContainer,
        transform: isOpen ? 'scale(1)' : 'scaleX(0)',
        opacity: isOpen ? 1 : 0
      }}>
        <div style={styles.leftPage}>
          <h2 style={styles.pageTitle}>RECENT NOTES</h2>
          <div style={styles.entryList} className="custom-scrollbar">
            {entries.length > 0 ? entries.map(entry => (
              <div key={entry.id} style={styles.entryItem}>
                <p style={styles.entryAuthor}>@{entry.author}</p>
                <p style={styles.entryText}>{entry.message}</p>
                {/* Backend'den gelen 'createdAt' kullanılıyor */}
                <span style={styles.entryDate}>{formatDate(entry.createdAt)}</span>
              </div>
            )) : (
              <p style={{fontSize: '8px', textAlign: 'center', marginTop: '50px'}}>No entries yet...</p>
            )}
          </div>
        </div>

        <div style={styles.rightPage}>
          <button onClick={onClose} style={styles.closeBtn}>[X]</button>
          
          {view === 'read' ? (
            <div style={styles.actionArea}>
              <p style={styles.description}>I'd love to hear your thoughts about my office or projects!</p>
              <button onClick={() => setView('write')} style={styles.pixelBtn}>WRITE A NOTE</button>
              <div style={styles.footerInfo}>REAL-TIME GUESTBOOK</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.formContainer}>
              <h3 style={styles.formTitle}>NEW ENTRY</h3>
              <div style={styles.inputGroup}>
                <label style={styles.label}>YOUR NAME:</label>
                <input 
                  type="text" 
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  onKeyDown={(e) => e.stopPropagation()} // Phaser'ın 'W,A,S,D' veya 'E' duymasını engeller
                  style={styles.pixelInput}
                  maxLength={15}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>MESSAGE:</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  onKeyDown={(e) => e.stopPropagation()}
                  style={{...styles.pixelInput, height: '100px', resize: 'none'}}
                  maxLength={100}
                  required
                />
              </div>
              <div style={styles.formButtons}>
                <button type="button" onClick={() => setView('read')} style={styles.cancelBtn}>BACK</button>
                <button type="submit" style={styles.submitBtn}>SEND</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  // --- ANA KAPLAYICILAR ---
  overlay: { 
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 
  },
  bookContainer: { 
    display: 'flex', width: '90%', height: '80%', 
    backgroundColor: '#6b4c35', border: '6px solid #3e2723', 
    boxShadow: '15px 15px 0px rgba(0,0,0,0.4)', 
    transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
    overflow: 'hidden' 
  },

  // --- SOL VE SAĞ SAYFA (LAYOUT DÜZELTMESİ) ---
  leftPage: { 
    flex: 1, 
    minWidth: 0, /* KRİTİK: İçerik taşsa bile sayfa genişlemez, %50 kalır */
    backgroundColor: '#f5f5dc', margin: '15px 5px 15px 15px', padding: '20px', 
    border: '2px solid #000', display: 'flex', flexDirection: 'column' 
  },
  rightPage: { 
    flex: 1, 
    minWidth: 0, /* KRİTİK: Sağ sayfanın ezilmesini engeller */
    backgroundColor: '#f5f5dc', margin: '15px 15px 15px 5px', padding: '20px', 
    border: '2px solid #000', position: 'relative' 
  },

  // --- İÇERİK DETAYLARI ---
  pageTitle: { 
    fontFamily: "'Press Start 2P', cursive", fontSize: '10px', textAlign: 'center', 
    borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '15px' 
  },
  entryList: { 
    overflowY: 'auto', flex: 1, paddingRight: '10px' /* Scrollbar için boşluk */
  },
  
  entryItem: { 
    marginBottom: '15px', borderBottom: '1px dashed #999', paddingBottom: '5px',
    display: 'flex', flexDirection: 'column' /* İçerikleri alt alta zorla */
  },
  
  entryAuthor: { 
    fontSize: '12px', color: '#8b0000', fontWeight: 'bold', marginBottom: '4px',
    wordBreak: 'break-all' /* Çok uzun isim girilirse satır atlat */
  },
  
  // --- METİN DÜZELTMESİ (TEXT WRAPPING) ---
  entryText: { 
    fontSize: '14px', color: '#333', lineHeight: '1.4', fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',       /* Satır sonlarını koru ama uzun satırları kır */
    overflowWrap: 'break-word',   /* Kelime bütünlüğünü koruyarak kır */
    wordBreak: 'break-word',      /* Gerekirse kelimeyi böl */
    maxWidth: '95%'              /* Kutudan taşmayı engelle */
  },
  
  entryDate: { fontSize: '7px', color: '#777', marginTop: '3px', alignSelf: 'flex-end' },
  closeBtn: { 
    position: 'absolute', top: '10px', right: '10px', background: 'none', 
    border: 'none', cursor: 'pointer', fontFamily: "'Press Start 2P', cursive", fontSize: '12px' 
  },
  
  // --- FORM STILLERI ---
  formContainer: { display: 'flex', flexDirection: 'column', height: '100%' },
  formTitle: { fontFamily: "'Press Start 2P', cursive", fontSize: '10px', marginBottom: '20px', color: '#2e7d32' },
  inputGroup: { marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '8px', fontWeight: 'bold' },
  pixelInput: { 
    border: '2px solid #000', padding: '8px', fontSize: '15px', 
    fontFamily: 'monospace', backgroundColor: '#fff',
    width: '100%', boxSizing: 'border-box' /* Padding, dahil hesapla */
  },
  formButtons: { display: 'flex', gap: '10px', marginTop: 'auto' },
  pixelBtn: { backgroundColor: '#2e7d32', color: 'white', border: '4px solid #1b5e20', padding: '10px 20px', cursor: 'pointer', fontFamily: "'Press Start 2P', cursive", fontSize: '8px' },
  submitBtn: { flex: 1, backgroundColor: '#2e7d32', color: 'white', border: '3px solid #1b5e20', padding: '10px', cursor: 'pointer', fontFamily: "'Press Start 2P', cursive", fontSize: '8px' },
  cancelBtn: { backgroundColor: '#c62828', color: 'white', border: '3px solid #b71c1c', padding: '10px', cursor: 'pointer', fontFamily: "'Press Start 2P', cursive", fontSize: '8px' },
  actionArea: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' },
  description: { fontSize: '9px', lineHeight: '1.6', marginBottom: '20px' },
  footerInfo: { position: 'absolute', bottom: '10px', fontSize: '7px', color: '#999' }
};

export default GuestBook;