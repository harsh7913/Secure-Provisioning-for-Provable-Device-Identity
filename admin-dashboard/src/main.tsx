import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster position="top-center" />
    </AuthProvider>
  </React.StrictMode>
);
