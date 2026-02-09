import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx' // Bu bizim Oyunumuz
import AdminPanel from './components/AdminPanel.jsx' // Birazdan oluşturacağız
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode'u kaldırdım (Phaser ile bazen double-render sorunu yapar, geliştirme aşamasında rahat edersin)
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  </BrowserRouter>,
)