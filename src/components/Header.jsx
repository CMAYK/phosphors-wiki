// components/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info } from 'lucide-react';

function Header() {
  const location = useLocation();

  return (
    <div style={{ 
      backgroundColor: 'rgba(38, 38, 38, 0.95)',
      borderBottom: '1px solid #525252'
    }} className="fixed top-0 left-0 right-0 backdrop-blur-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-center items-center">
        <div className="flex gap-4">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              location.pathname === '/' 
                ? 'text-white' 
                : 'text-neutral-300 hover:text-white'
            }`}
            style={{ 
              backgroundColor: location.pathname === '/' ? '#525252' : 'transparent'
            }}
          >
            <Home size={18} />
            Phosphors.Wiki
          </Link>
          <Link
            to="/about"
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              location.pathname === '/about' 
                ? 'text-white' 
                : 'text-neutral-300 hover:text-white'
            }`}
            style={{ 
              backgroundColor: location.pathname === '/about' ? '#525252' : 'transparent'
            }}
          >
            <Info size={18} />
            What is this?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;