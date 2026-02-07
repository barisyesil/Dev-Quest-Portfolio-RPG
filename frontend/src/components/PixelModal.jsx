import React, { useState } from 'react';
import { dataMap } from '../data/dataRegistry'; // Artık merkezi registry'i kullanıyoruz

const PixelModal = ({ contentKey, onClose }) => {
  const [selectedId, setSelectedId] = useState(null);
  
  // Registry'den wrapper nesnesini alıyoruz: { type: 'modal', data: { ... } }
  const wrapper = dataMap[contentKey];
  
  // Güvenlik kontrolü: Veri yoksa veya items tanımlı değilse render etme
  if (!wrapper || !wrapper.data || !wrapper.data.items) {
    console.error("Modal verisi bulunamadı veya formatı hatalı:", contentKey);
    return null;
  }

  const data = wrapper.data; // Asıl içerik (title ve items)

  return (
    <div style={styles.overlay}>
      <div style={styles.modalBox}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.title}>{data.title}</span>
          <button onClick={onClose} style={styles.closeBtn}>[X]</button>
        </div>

        {/* Liste Alanı */}
        <div style={styles.listContainer} className="custom-scrollbar">
          {data.items.map((item) => (
            <div key={item.id} style={{ marginBottom: '15px' }}>
              <button 
                onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
                style={{
                  ...styles.itemBtn,
                  color: selectedId === item.id ? '#f1c40f' : 'white',
                }}
              >
                {selectedId === item.id ? '> ' : '  '} {item.name}
              </button>
              
              {selectedId === item.id && (
                <div style={styles.detailsBox}>
                  <p style={styles.description}>{item.description}</p>
                  
                  {/* Etiketler (Tech, Date, Issuer vb.) */}
                  <div style={styles.tagContainer}>
                    {item.tags && item.tags.map(tag => (
                      <span key={tag} style={styles.tag}>[{tag}]</span>
                    ))}
                  </div>

                  {/* Varsa Link Butonu */}
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noreferrer" style={styles.linkBtn}>
                      VIEW DETAILS
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={styles.footer}>PRESS ESC TO RETURN</div>
      </div>
    </div>
  );
};
// Inline Styles (Daha temiz görünüm için dışarı aldım)
const styles = {
  overlay: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modalBox: {
    backgroundColor: '#0000aa', border: '4px solid white',
    boxShadow: '10px 10px 0px black', width: '85%', maxHeight: '85%',
    display: 'flex', flexDirection: 'column', overflow: 'hidden'
  },
  header: {
    padding: '15px', borderBottom: '4px solid white',
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', backgroundColor: '#000088'
  },
  title: { color: 'white', fontSize: '12px', textTransform: 'uppercase' },
  closeBtn: { background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' },
  listContainer: { padding: '20px', overflowY: 'auto', flex: 1 },
  itemBtn: {
    width: '100%', textAlign: 'left', backgroundColor: '#000055',
    border: '2px solid white', padding: '10px',
    fontFamily: "'Press Start 2P', cursive", fontSize: '10px', cursor: 'pointer'
  },
  detailsBox: {
    padding: '15px', backgroundColor: '#000', border: '2px solid white',
    borderTop: 'none', fontSize: '9px', lineHeight: '1.6'
  },
  description: { color: '#aaa', marginBottom: '10px' },
  tagContainer: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  tag: { color: '#2ecc71' },
  linkBtn: {
    display: 'inline-block', marginTop: '15px', backgroundColor: 'white',
    color: 'black', padding: '5px 10px', textDecoration: 'none', fontWeight: 'bold'
  },
  footer: { padding: '10px', textAlign: 'center', fontSize: '8px', color: '#888' }
};

export default PixelModal;