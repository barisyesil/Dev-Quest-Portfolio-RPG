const API_BASE_URL = 'http://localhost:5174/api'; // Backend portunu kontrol et (5000, 5123 vs olabilir)

export const api = {
  // --- OKUMA İŞLEMLERİ (GET) ---
  getItems: async (category) => {
    const response = await fetch(`${API_BASE_URL}/Content/items/${category}`);
    return await response.json();
  },

  getDialogues: async () => {
    const response = await fetch(`${API_BASE_URL}/Content/dialogues`);
    return await response.json();
  },

  getGuestBook: async () => {
    const response = await fetch(`${API_BASE_URL}/GuestBook`);
    return await response.json();
  },

  // --- HALKA AÇIK FORM (POST) ---
  postGuestBookEntry: async (entry) => {
    const response = await fetch(`${API_BASE_URL}/GuestBook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    return await response.json();
  },

  // --- ADMİN PANELİ: SİLME (DELETE) ---
  deleteItem: async (category, id) => {
    let endpoint = '';

    if (category === 'projects' || category === 'achievements') {
      endpoint = `Content/items/${id}`;
    } else if (category === 'dialogues') {
      endpoint = `Content/dialogues/${id}`;
    } else if (category === 'guestbook') {
      endpoint = `GuestBook/${id}`;
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Silme işlemi başarısız oldu.');
    }
    return true;
  },

  // --- ADMİN PANELİ: KAYDETME/GÜNCELLEME (POST/PUT) ---
  // Bu fonksiyon hem "Yeni Ekle" hem de "Düzenle" butonları için çalışır.
  saveItem: async (category, item) => {
    let url = '';
    // ID varsa PUT (Güncelle), yoksa POST (Ekle)
    const method = item.id ? 'PUT' : 'POST'; 

    // Endpoint Belirleme
    if (category === 'projects' || category === 'achievements') {
      url = item.id 
        ? `${API_BASE_URL}/Content/items/${item.id}` 
        : `${API_BASE_URL}/Content/items`;
      
      // Eğer yeni kayıt ise (POST), backend'in beklediği 'Category' alanını ekle
      if (!item.id) {
        item.category = category === 'projects' ? 'Project' : 'Achievement';
      }
    } 
    else if (category === 'dialogues') {
      url = item.id 
        ? `${API_BASE_URL}/Content/dialogues/${item.id}` 
        : `${API_BASE_URL}/Content/dialogues`;
    }

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });

    // PUT istekleri genelde "204 No Content" döner, bu yüzden response.json() hata verebilir.
    // Başarılıysa true dönelim.
    if (method === 'PUT') {
        if (!response.ok) throw new Error('Güncelleme başarısız');
        return true;
    }

    return await response.json();
  }
};