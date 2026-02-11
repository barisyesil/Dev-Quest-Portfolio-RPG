import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({}); 

  // FIX: fetchData'yı useEffect içine aldık veya useCallback ile sarmalayabiliriz.
  // Burada useEffect içinde tanımlamak en kolayı.
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
          let data = [];
          if (activeTab === 'projects') data = await api.getItems('Project');
          else if (activeTab === 'achievements') data = await api.getItems('Achievement');
          else if (activeTab === 'dialogues') data = await api.getDialogues();
          else if (activeTab === 'guestbook') data = await api.getGuestBook();
          setItems(data);
        } catch (error) {
          console.error("Veri hatası:", error);
        } finally {
          setLoading(false);
        }
      };

    fetchData();
  }, [activeTab]); // Sadece activeTab değişince çalışır

  // Listeyi manuel yenilemek için yardımcı fonksiyon
  const reloadData = async () => {
    setLoading(true);
    try {
        let data = [];
        if (activeTab === 'projects') data = await api.getItems('Project');
        else if (activeTab === 'achievements') data = await api.getItems('Achievement');
        else if (activeTab === 'dialogues') data = await api.getDialogues();
        else if (activeTab === 'guestbook') data = await api.getGuestBook();
        setItems(data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  // SİLME
  const handleDelete = async (id) => {
    if(!window.confirm("Bu kaydı kalıcı olarak silmek istediğine emin misin?")) return;
    try {
      await api.deleteItem(activeTab, id);
      reloadData(); 
    } catch (error) {
      console.error("Silinemedi:", error);
      alert("Silme işlemi başarısız oldu.");
    }
  };

  // DÜZENLEME MODUNU AÇ
  const handleEdit = (item) => {
    setFormData({ ...item }); 
    setIsModalOpen(true);
  };

  // YENİ EKLEME MODUNU AÇ
  const handleAddNew = () => {
    setFormData({}); 
    setIsModalOpen(true);
  };

  // KAYDET
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.saveItem(activeTab, formData);
      setIsModalOpen(false);
      reloadData(); 
    } catch (error) {
      console.error("Kaydedilemedi:", error);
      alert("Hata oluştu, konsolu kontrol et.");
    }
  };

  // FORM INPUTLARI
  const renderFormFields = () => {
    if (activeTab === 'guestbook') return <p style={{color: '#aaa', fontStyle: 'italic'}}>Guestbook entries cannot be edited here, only deleted.</p>;

    if (activeTab === 'dialogues') {
      return (
        <>
          <div className="form-group">
            <label className="form-label">Key (Unique ID)</label>
            <input 
              className="form-input" 
              value={formData.key || ''} 
              onChange={e => setFormData({...formData, key: e.target.value})} 
              placeholder="e.g., wc_easter_egg"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Dialogue Text</label>
            <textarea 
              className="form-input" 
              rows="5"
              value={formData.text || ''} 
              onChange={e => setFormData({...formData, text: e.target.value})} 
            />
          </div>
        </>
      );
    }

    // Projects & Achievements
    return (
      <>
        <div className="form-group">
          <label className="form-label">Name / Title</label>
          <input 
            className="form-input" 
            value={formData.name || ''} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            placeholder="Project Name"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea 
            className="form-input" 
            rows="4"
            value={formData.description || ''} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
            placeholder="Detailed description..."
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Tags (Comma separated)</label>
          <input 
            className="form-input" 
            value={formData.tags || ''} 
            onChange={e => setFormData({...formData, tags: e.target.value})} 
            placeholder="React, C#, SQL"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Link (GitHub/Demo)</label>
          <input 
            className="form-input" 
            value={formData.link || ''} 
            onChange={e => setFormData({...formData, link: e.target.value})} 
            placeholder="https://..."
          />
        </div>
      </>
    );
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-logo">DEV:CONSOLE</div>
        
        {['projects', 'achievements', 'dialogues', 'guestbook'].map(tab => (
            <button 
              key={tab}
              className={`nav-btn ${activeTab === tab ? 'active' : ''}`} 
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
        ))}

        <a href="/" className="back-link">← Return to Game World</a>
      </div>

      <div className="admin-content">
        <div className="content-header">
          <h1 className="page-title">{activeTab.toUpperCase()} MANAGER</h1>
          {activeTab !== 'guestbook' && (
            <button className="add-btn" onClick={handleAddNew}>+ NEW ENTRY</button>
          )}
        </div>

        {/* TABLO ALANI */}
        <div className="table-container">
            {/* FIX: Loading göstergesi eklendi */}
            {loading ? (
                <div style={{color: '#0f0', padding: '20px', fontFamily: 'monospace'}}>
                    LOADING DATABASE...
                </div>
            ) : (
                <table className="data-table">
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Name / Key</th>
                    <th>Description</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr><td colSpan="4" style={{textAlign:'center', padding:'20px'}}>No records found.</td></tr>
                    ) : (
                        items.map(item => (
                        <tr key={item.id}>
                            <td>#{item.id}</td>
                            <td>{item.name || item.author || item.key}</td>
                            <td style={{maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                {item.description || item.text || item.message}
                            </td>
                            <td>
                            {activeTab !== 'guestbook' && (
                                <button className="action-btn edit-btn" onClick={() => handleEdit(item)}>EDIT</button>
                            )}
                            <button className="action-btn del-btn" onClick={() => handleDelete(item.id)}>DEL</button>
                            </td>
                        </tr>
                        ))
                    )}
                </tbody>
                </table>
            )}
        </div>
      </div>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content"> 
            <h2>{formData.id ? 'EDIT ENTRY' : 'NEW ENTRY'}</h2>
            <form onSubmit={handleSubmit}>
              
              {renderFormFields()}

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>CANCEL</button>
                <button type="submit" className="save-btn">SAVE CHANGES</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;