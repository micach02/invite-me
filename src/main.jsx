import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <App />
        <Toaster
          position="top-center" gutter={10}
          toastOptions={{
            duration: 3500,
            style: { borderRadius: '12px', background: '#252923', color: '#fff', fontSize: '14px', fontWeight: 500, padding: '10px 14px', boxShadow: '0 12px 24px -6px rgba(37,41,35,.3)' },
            success: { iconTheme: { primary: '#7FD1A0', secondary: '#252923' } },
            error: { iconTheme: { primary: '#FF8A8A', secondary: '#252923' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
