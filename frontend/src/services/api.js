const API_BASE_URL = 'http://localhost:5174/api'; 

export const api = {
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

  postGuestBookEntry: async (entry) => {
    const response = await fetch(`${API_BASE_URL}/GuestBook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry) // Hata düzeltildi
    });
    return await response.json();
  }
};