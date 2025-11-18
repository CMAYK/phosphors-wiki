import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ManufacturerPage from './pages/ManufacturerPage';
import CrtDetailPage from './pages/CrtDetailPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import Header from './components/Header';
import { colors } from './components/colors';
import './storage';

function App() {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: colors.background }} className="min-h-screen">
        <Header />
        <main className="max-w-[1600px] mx-auto px-8 py-6 pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/manufacturer/:slug" element={<ManufacturerPage />} />
            <Route path="/manufacturer/:slug/:model" element={<CrtDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

// serviceWorkerRegistration.js
export const registerSW = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

export default App;