// HomePage.jsx - Using central color palette
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { manufacturers, crts } from '../data';
import { colors, bg, border, text, style } from '../components/colors';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Pre-caching effect for critical images
  useEffect(() => {
    const preloadImages = async () => {
      const imageUrls = new Set();
      
      // Add critical images
      imageUrls.add('logo.png');
      
      // Add manufacturer logos (first 12 for initial view)
      manufacturers.slice(0, 12).forEach(manufacturer => {
        if (manufacturer.logo) {
          imageUrls.add(manufacturer.logo);
        }
      });

      // Preload images
      const preloadPromises = Array.from(imageUrls).map(url => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });

      await Promise.all(preloadPromises);
    };

    const timer = setTimeout(preloadImages, 100);
    return () => clearTimeout(timer);
  }, []);

  // Preload remaining images
  useEffect(() => {
    const preloadRemainingImages = () => {
      const remainingLogos = manufacturers.map(m => m.logo).filter(Boolean);
      remainingLogos.forEach(logo => {
        const img = new Image();
        img.src = logo;
      });
    };

    const timer = setTimeout(preloadRemainingImages, 2000);

    const handleUserInteraction = () => {
      preloadRemainingImages();
      document.removeEventListener('mousemove', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('mousemove', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousemove', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Pre-compute counts once
  const manufacturerCounts = useMemo(() => {
    const map = new Map();
    crts.forEach((crt) => {
      map.set(crt.brand, (map.get(crt.brand) || 0) + 1);
    });
    return map;
  }, [crts]);

  // Filter by search AND remove manufacturers with 0 entries
  const filteredManufacturers = useMemo(() => {
    return manufacturers.filter((m) => {
      const count = manufacturerCounts.get(m.name) || 0;
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch && count > -1;
    });
  }, [manufacturers, searchTerm, manufacturerCounts]);

  // Sort alphabetically by default
  const displayedManufacturers = [...filteredManufacturers].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  const getCount = (name) => manufacturerCounts.get(name) || 0;

  // Reusable logo component
  const ManufacturerLogo = ({ src, name, size = 'large' }) => {
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      if (src) {
        const img = new Image();
        img.src = src;
        if (img.complete) {
          setLoaded(true);
        }
      }
    }, [src]);

    if (error || !src) {
      return (
        <span
          className={`font-bold flex items-center justify-center ${
            size === 'large' ? 'text-4xl' : 'text-xl'
          }`}
          style={text(colors.textTertiary)}
        >
          {name[0].toUpperCase()}
        </span>
      );
    }

    return (
      <div className="relative w-full h-full">
        {!loaded && (
          <div className={`absolute inset-0 flex items-center justify-center ${
            size === 'large' ? 'p-1' : 'p-2'
          }`} style={bg(colors.cardBg)}>
            <div className="w-full h-full rounded-sm animate-pulse" style={bg(colors.interactive)}></div>
          </div>
        )}
        
        <img
          src={src}
          alt=""
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          loading="lazy"
          className={`w-full h-full object-contain transition-opacity duration-500 ${
            size === 'large' ? 'p-1' : 'p-2'
          } ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            filter: 'brightness(0) invert(1)', 
            opacity: 0.9,
          }}
        />
      </div>
    );
  };

  // Grid card - Dark cards with light text
  const ManufacturerGridCard = ({ manufacturer, count }) => {
    const slug = manufacturer.name.toLowerCase().replace(/\s+/g, '-');

    return (
      <Link
        to={`/manufacturer/${slug}`}
        className="border rounded-md overflow-hidden hover:bg-neutral-700 transition-all transform hover:scale-105 group"
        style={style(bg(colors.cardBg), border(colors.border), { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)' })}
      >
        <div className="aspect-[4/3] flex items-center justify-center relative" style={bg(colors.darkBg)}>
          <ManufacturerLogo src={manufacturer.logo} name={manufacturer.name} size="large" />
        </div>
        <div className="border-t p-3 text-left" style={border(colors.border)}>
          <h4 className="text-sm font-semibold text-white truncate">{manufacturer.name}</h4>
          <p className="text-xs mt-1" style={text(colors.textSecondary)}>
            {count} model{count !== 1 ? 's' : ''}
          </p>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen" style={bg(colors.background)}>
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center py-8 mb-8 gap-8">
        <div className="flex-shrink-0">
          <img
            src="logo.png"
            alt="Phosphors Wiki Logo"
            className="w-48 h-auto"
          />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold text-white mb-2">Phosphors.Wiki</h2>
          <p className="text-xl" style={text(colors.textSecondary)}>
            The community-made CRT collection.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="mb-12">
        {/* Header + controls */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">Browse by Brand</h3>
              <p style={text(colors.textSecondary)}>
                {searchTerm
                  ? `${filteredManufacturers.length} / ${manufacturers.filter(m => (manufacturerCounts.get(m.name) || 0) > 0).length}`
                  : manufacturers.filter(m => (manufacturerCounts.get(m.name) || 0) > 0).length}{' '}
                brands • {crts.length} CRTs cataloged
              </p>
            </div>
          </div>

          {/* Search - extended to full width */}
          <div className="relative w-full">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2" style={text(colors.textTertiary)} />
            <input
              type="text"
              placeholder="Search CRTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-md text-white transition-colors"
              style={style(bg(colors.cardBg), border(colors.border), { border: '1px solid' })}
            />
          </div>
        </div>

        {/* Results */}
        {displayedManufacturers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl" style={text(colors.textTertiary)}>No manufacturers match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-8">
            {displayedManufacturers.map((manufacturer) => (
              <ManufacturerGridCard
                key={manufacturer.id}
                manufacturer={manufacturer}
                count={getCount(manufacturer.name)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;