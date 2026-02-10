import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import Login from './components/Login.jsx'
import './index.css'

// KORUMALI ROTA BİLEŞENİ (Wrapper)
// Eğer token varsa sayfayı göster, yoksa Login'e at.
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  // Token kontrolü basitçe yapılıyor. Gerçekte token süresi vs. de kontrol edilir.
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      
      {/* Admin Panelini Koruma Altına Alıyoruz */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } 
      />
    </Routes>
  </BrowserRouter>,
)