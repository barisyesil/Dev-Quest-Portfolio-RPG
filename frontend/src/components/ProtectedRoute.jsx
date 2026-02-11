import React from 'react';
import { Navigate } from 'react-router-dom';

// KORUMALI ROTA BİLEŞENİ
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  
  // Token yoksa Login sayfasına at
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;