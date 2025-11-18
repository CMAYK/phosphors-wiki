import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CrtForm from '../components/CrtForm';
import { colors, bg, border, text, style } from '../components/colors';
import { Lock } from 'lucide-react';

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password check - replace 'admin123' with your actual password
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="rounded-xl p-8 border" style={style(bg(colors.cardBg), border(colors.border))}>
          <div className="flex items-center gap-3 mb-6">
            <Lock size={32} className="text-white" />
            <h2 className="text-3xl font-bold text-white">Admin Access</h2>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded border text-white"
                style={style(bg(colors.darkBg), border(colors.border))}
                placeholder="Enter admin password"
              />
            </div>
            
            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}
            
            <button
              type="submit"
              className="w-full py-3 rounded font-semibold text-white transition-colors"
              style={style(bg(colors.interactive), { ':hover': bg('#5a5a5a') })}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
        <p style={text(colors.textSecondary)}>Add or edit CRT entries</p>
      </div>
      
      <CrtForm />
    </div>
  );
}

export default AdminPage;