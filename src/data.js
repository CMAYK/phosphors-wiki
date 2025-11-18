// src/data.js
import manufacturersData from './data/manufacturers.json';
import crtsData from './data/crts.json';

export const manufacturers = manufacturersData;
export const crts = crtsData;

// Helper function to get color for CRT purpose/type
export function getPurposeColor(purpose) {
  const colors = {
    'Professional Monitor': 'bg-blue-600/30 text-blue-200 border-blue-500/30',
    'Consumer TV': 'bg-green-600/30 text-green-200 border-green-500/30',
    'Broadcast Monitor': 'bg-purple-600/30 text-purple-200 border-purple-500/30',
    'Medical Monitor': 'bg-red-600/30 text-red-200 border-red-500/30',
    'Gaming Monitor': 'bg-orange-600/30 text-orange-200 border-orange-500/30',
    'Computer Monitor': 'bg-cyan-600/30 text-cyan-200 border-cyan-500/30'
  };
  
  return colors[purpose] || 'bg-slate-700 text-slate-300 border-slate-600';
}