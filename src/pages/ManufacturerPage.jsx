import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Monitor } from 'lucide-react';
import { manufacturers, crts, getPurposeColor } from '../data';
import { colors, bg, border, text, style } from '../components/colors';

function ManufacturerPage() {
  const { slug } = useParams();
  
  // Find manufacturer by slug
  const manufacturer = manufacturers.find(
    m => m.name.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!manufacturer) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold text-white mb-4">Manufacturer Not Found</h2>
        <Link to="/" className="text-blue-400 hover:text-blue-300">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const manufacturerCrts = crts.filter(crt => crt.brand === manufacturer.name);

  return (
    <div>
      {/* Back Button */}
      <Link 
        to="/"
        className="inline-flex items-center gap-2 hover:text-white mb-4 transition-colors"
        style={text(colors.textTertiary)}
      >
        <ArrowLeft size={20} />
        Back to Manufacturers
      </Link>

      {/* Manufacturer Header */}
      <div className="rounded p-8 mb-8 border" style={style(bg(colors.cardBg), border(colors.border))}>
        <h2 className="text-4xl font-bold text-white mb-4">{manufacturer.name}</h2>
        <p className="text-lg" style={text(colors.textSecondary)}>{manufacturer.description}</p>
      </div>

      {/* CRT Section */}
      <div className="mb-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-1">Models</h3>
          <p style={text(colors.textTertiary)}>
            {manufacturerCrts.length} CRT{manufacturerCrts.length !== 1 ? 's' : ''} in database
          </p>
        </div>

        {manufacturerCrts.length === 0 ? (
          // No CRTs found
          <div className="rounded p-12 text-center border" style={style(bg(colors.cardBg), border(colors.border))}>
            <Monitor size={64} className="mx-auto mb-4" style={text(colors.textDisabled)} />
            <h4 className="text-xl font-bold text-white mb-2">No CRTs Yet</h4>
            <p style={text(colors.textTertiary)}>
              This manufacturer doesn't have any CRTs in the database yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {manufacturerCrts.map((crt) => {
              const modelSlug = crt.model.toLowerCase().replace(/\s+/g, '-');
              
              return (
                <Link
                  key={crt.id}
                  to={`/manufacturer/${slug}/${modelSlug}`}
                  className="rounded overflow-hidden transition-all transform hover:scale-105 group border"
                  style={style(bg(colors.cardBg), border(colors.border))}
                >
                  {/* Image or Placeholder */}
                  <div className="aspect-video flex items-center justify-center border-b" style={style(bg(colors.darkBg), border(colors.border))}>
                    {crt.images && crt.images.length > 0 ? (
                      <img
                        src={`http://localhost:3001${crt.images[0]}`}
                        alt={crt.model}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <Monitor 
                      size={64} 
                      className="group-hover:text-slate-500 transition-colors" 
                      style={style(text(colors.textDisabled), crt.images && crt.images.length > 0 ? { display: 'none' } : {})} 
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {crt.model}
                    </h4>
                    
                    {/* Badges - Type, Size, Year */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 rounded text-xs border ${getPurposeColor(crt.purpose)}`}>
                        {crt.purpose}
                      </span>
                      <span className="px-2 py-1 rounded text-xs" style={style(bg(colors.interactive), text(colors.textSecondary))}>
                        {crt.screenSize}
                      </span>
                      {crt.year && (
                        <span className="px-2 py-1 rounded text-xs" style={style(bg(colors.interactive), text(colors.textSecondary))}>
                          {crt.year}
                        </span>
                      )}
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm line-clamp-2" style={text(colors.textTertiary)}>
                      {crt.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManufacturerPage;