import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Monitor, AlertTriangle, AlertCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { manufacturers, crts, getPurposeColor } from '../data';
import { colors, bg, border, text, style } from '../components/colors';

function CrtDetailPage() {
  const { slug, model } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  // Find the CRT by matching the model slug
  const crt = crts.find(c => 
    c.model.toLowerCase().replace(/\s+/g, '-') === model &&
    c.brand.toLowerCase().replace(/\s+/g, '-') === slug
  );
  
  // Find manufacturer
  const manufacturer = manufacturers.find(
    m => m.name.toLowerCase().replace(/\s+/g, '-') === slug
  );

  console.log('All CRTs:', crts);
  console.log('Looking for model:', model, 'brand:', slug);
  console.log('Found CRT:', crt);
  console.log('CRT images:', crt ? crt.images : 'no crt found');

  if (!crt || !manufacturer) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold text-white mb-4">CRT Not Found</h2>
        <Link to={`/manufacturer/${slug}`} className="text-blue-400 hover:text-blue-300">
          ← Back to Manufacturer
        </Link>
      </div>
    );
  }

  // Check if page is incomplete (has null values)
  const isIncomplete = Object.entries(crt).some(([key, value]) => {
    if (key === 'id' || key === 'hotChassis' || key === 'images') return false;
    if (Array.isArray(value)) return value.length === 0;
    return value === null || value === undefined || value === '';
  });

  const hasImages = crt.images && crt.images.length > 0;
  const totalImages = hasImages ? crt.images.length : 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const openLightbox = () => {
    if (hasImages) {
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Helper function to check if power array has valid data
  const hasValidPower = crt.power && crt.power.length > 0 && 
    crt.power.some(p => p && (p.voltage || p.freq || p.watt));

  // Helper function to check if a section has any non-null values
  const hasGeneralInfo = crt.brand || crt.manufacturer || crt.model || crt.year || crt.brandSeries || crt.chassis || crt.purpose || crt.market || crt.launchMSRP;
  
  const hasDisplayInfo = crt.screenSize || crt.tubeSize || crt.tubeModel || crt.tubeType || crt.tubeTVL || 
    (crt.supportedResolution && crt.supportedResolution.length > 0) || crt.horizontalScanRate || 
    crt.aspectRatio || crt.chassisAspectRatio || crt.videoSystem || crt.tintedTube !== null || crt.removeableTint !== null;
  
  const hasIOInfo = (crt.videoInputs && crt.videoInputs.length > 0) || 
    (crt.videoOutputs && crt.videoOutputs.length > 0) || 
    (crt.otherIO && crt.otherIO.length > 0);
  
  const hasControlsInfo = crt.onScreenDisplay !== null || crt.adjustments || crt.remote || crt.serviceMenu;
  
  const hasInternalComponents = crt.horizontalOutputTransistor || crt.flybackTransformer || 
    crt.verticalDeflectionIC || crt.jungleIC;
  
  const hasPhysicalInfo = crt.weight || crt.size || hasValidPower;
  
  const hasAudioInfo = crt.speakers && (crt.speakers.config || crt.speakers.wattage);

  // Check if there's any specification data at all
  const hasAnySpecs = hasGeneralInfo || hasDisplayInfo || hasIOInfo || hasControlsInfo || 
    hasInternalComponents || hasPhysicalInfo || hasAudioInfo || crt.extraFeatures;

  return (
    <div>
      {/* Lightbox */}
      {lightboxOpen && hasImages && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X size={32} />
          </button>

          {/* Navigation Buttons */}
          {totalImages > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
                style={{ background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '4px' }}
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
                style={{ background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '4px' }}
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Lightbox Image */}
          <img
            src={`http://localhost:3001${crt.images[currentImageIndex]}`}
            alt={`${crt.brand} ${crt.model}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Image Counter */}
          {totalImages > 1 && (
            <div 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm"
              style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '4px' }}
            >
              {currentImageIndex + 1} / {totalImages}
            </div>
          )}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6" style={text(colors.textTertiary)}>
        <Link to="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>→</span>
        <Link to={`/manufacturer/${slug}`} className="hover:text-white transition-colors">
          {manufacturer.name}
        </Link>
        <span>→</span>
        <span className="text-white">{crt.model}</span>
      </div>

      {/* Incomplete Page Warning */}
      {isIncomplete && (
        <div className="bg-purple-900/40 border-l-4 border-purple-500 p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="text-purple-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-purple-300 font-semibold mb-1">Incomplete Information</h4>
            <p className="text-purple-200 text-sm">
              This page is incomplete. You can help by contributing additional details about this CRT!
            </p>
          </div>
        </div>
      )}

      {/* Combined Gallery and Main Content Box */}
      <div className="rounded p-8 mb-6 border" style={style(bg(colors.cardBg), border(colors.border))}>
        <div className="flex flex-col lg:flex-row gap-8 mb-6">
          {/* Gallery Section - Left Side */}
          <div className="lg:w-[400px] flex-shrink-0">
            <h3 className="text-white font-semibold mb-4">Gallery</h3>
            
            {hasImages ? (
              <>
                {/* Main Image with Navigation */}
                <div className="relative aspect-square rounded flex items-center justify-center mb-4 overflow-hidden group" style={bg(colors.darkBg)}>
                  <img
                    src={`http://localhost:3001${crt.images[currentImageIndex]}`}
                    alt={`${crt.brand} ${crt.model}`}
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={openLightbox}
                  />
                  
                  {/* Navigation Buttons - Only show if more than 1 image */}
                  {totalImages > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'rgba(0,0,0,0.6)', padding: '8px', borderRadius: '4px' }}
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'rgba(0,0,0,0.6)', padding: '8px', borderRadius: '4px' }}
                      >
                        <ChevronRight size={24} />
                      </button>

                      {/* Image Counter */}
                      <div 
                        className="absolute bottom-2 right-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px' }}
                      >
                        {currentImageIndex + 1} / {totalImages}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Thumbnail Grid */}
                {totalImages > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {crt.images.map((img, i) => (
                      <div 
                        key={i} 
                        className={`aspect-square rounded flex items-center justify-center overflow-hidden cursor-pointer border-2 transition-all ${
                          i === currentImageIndex ? 'border-blue-500' : 'border-transparent hover:border-gray-500'
                        }`}
                        style={bg(colors.darkBg)}
                        onClick={() => setCurrentImageIndex(i)}
                      >
                        <img
                          src={`http://localhost:3001${img}`}
                          alt={`${crt.brand} ${crt.model} ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Placeholder */}
                <div className="aspect-square rounded flex items-center justify-center mb-4" style={bg(colors.darkBg)}>
                  <Monitor size={80} style={text(colors.textDisabled)} />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-square rounded flex items-center justify-center" style={bg(colors.darkBg)}>
                      <Monitor size={24} style={text(colors.textDisabled)} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Main Content - Right Side */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-white mb-2">
                {crt.brand} {crt.model}
              </h1>
              
              {/* Badges */}
              <div className="flex gap-3 mb-4">
                <span className={`px-3 py-1 rounded border ${getPurposeColor(crt.purpose)}`}>
                  {`${crt.purpose} ${crt.purposeType}`}
                </span>
                <span className="px-3 py-1 rounded" style={style(bg(colors.interactive), text(colors.textSecondary))}>
                  {crt.screenSize + '"'}
                </span>
                {crt.year && (
                  <span className="px-3 py-1 rounded" style={style(bg(colors.interactive), text(colors.textSecondary))}>
                    {crt.year}
                  </span>
                )}
              </div>
            </div>
            
            {/* Description */}
            {crt.description && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-3">Description</h3>
                <p className="text-lg leading-relaxed" style={text(colors.textSecondary)}>
                  {crt.description}
                </p>
              </div>
            )}

            {/* Hot Chassis Warning - Reduced Padding */}
            {crt.hotChassis && (
              <div className="bg-red-900/40 border-l-4 border-red-500 p-2 mb-6 flex items-start gap-2">
                <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-red-300 font-bold mb-1">WARNING - HOT CHASSIS</h4>
                  <p className="text-red-200 text-sm leading-relaxed">
                    This CRT has a <strong>hot chassis</strong> design, meaning the internal circuitry is directly connected to mains voltage. 
                    Working inside this unit without proper isolation can result in <strong>serious injury or death</strong>.<br class="mb-2" /><strong><u>Learn More</u></strong>
                  </p>
                </div>
              </div>
            )}

            {/* Documentation */}
            {crt.documentation && crt.documentation.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-3">Documentation</h3>
                <div className="space-y-2">
                  {crt.documentation.map((doc, idx) => (
                    <a 
                      key={idx}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {doc.title} →
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Models - Full Width at Bottom */}
        {crt.similarModels && crt.similarModels.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Similar Models</h3>
            <div className="flex flex-wrap gap-2">
              {crt.similarModels
                .filter(modelName => modelName && modelName !== null && modelName !== '')
                .map((modelName, idx) => {
                  const similarSlug = crt.brand.toLowerCase().replace(/\s+/g, '-');
                  const similarModelSlug = modelName.toLowerCase().replace(/\s+/g, '-');
                  
                  return (
                    <Link
                      key={idx}
                      to={`/manufacturer/${similarSlug}/${similarModelSlug}`}
                      className="px-3 py-1 rounded text-sm transition-colors hover:bg-slate-600"
                      style={style(bg(colors.interactive), text(colors.textSecondary))}
                    >
                      {modelName}
                    </Link>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Technical Specifications - Only show if there's any data */}
      {hasAnySpecs && (
        <div className="rounded p-8 border" style={style(bg(colors.cardBg), border(colors.border))}>
          <h3 className="text-2xl font-bold text-white mb-6">Technical Specifications</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* General Information */}
            {hasGeneralInfo && (
              <div>
                <h4 className="text-sm uppercase mb-4 font-semibold" style={text(colors.textTertiary)}>General Information</h4>
                <div className="space-y-3">
                  <SpecRow 
                  label="Brand" 
                  value={
                    <Link to={`/manufacturer/${slug}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                        {crt.brand}
                      </Link>
                  } />
                  <SpecRow label="Manufacturer" value={crt.manufacturer}/>
                  <SpecRow label="Model" value={crt.model} />
                  <SpecRow label="Year" value={crt.year} />
                  <SpecRow label="Brand Series" value={crt.brandSeries} />
                  <SpecRow label="Chassis" value={crt.chassis} />
                  <SpecRow label="Purpose" value={crt.purpose} />
                  <SpecRow label="Market" value={crt.market} />
                  <SpecRow label="Launch MSRP" value={crt.launchMSRP ? `$${crt.launchMSRP}` : null} />
                </div>
              </div>
            )}

            {/* Display Specifications */}
            {hasDisplayInfo && (
              <div>
                <h4 className="text-sm uppercase mb-4 font-semibold" style={text(colors.textTertiary)}>Display</h4>
                <div className="space-y-3">
                  <SpecRow label="Viewable Size" value={crt.screenSize} />
                  <SpecRow label="Tube Size" value={crt.tubeSize} />
                  <SpecRow label="Tube Model" value={crt.tubeModel} />
                  <SpecRow label="Tube Type" value={crt.tubeType} />
                  <SpecRow label="TVL" value={crt.tubeTVL} />
                  <SpecRow 
                    label="Supported Resolutions" 
                    value={crt.supportedResolution ? crt.supportedResolution.join(', ') : null} 
                  />
                  <SpecRow label="Horizontal Scan Rate" value={crt.horizontalScanRate} />
                  <SpecRow label="Aspect Ratio" value={crt.aspectRatio} />
                  <SpecRow label="16:9 Compatibility" value={crt.chassisAspectRatio} />
                  <SpecRow label="Video System" value={crt.videoSystem} />
                  <SpecRow label="Tinted Tube" value={crt.tintedTube ? 'Yes' : 'No'} />
                  <SpecRow label="Removeable Tint" value={crt.removeableTint ? 'Yes' : 'No'} />
                </div>
              </div>
            )}

            {/* Input/Output */}
            {hasIOInfo && (
              <div className="md:col-span-2">
                <h4 className="text-sm uppercase mb-4 font-semibold" style={text(colors.textTertiary)}>Input/Output</h4>
                <div className="space-y-3">
                  {crt.videoInputs && crt.videoInputs.length > 0 && (
                    <div className="py-2 border-b" style={border(colors.border)}>
                      <div className="flex justify-between">
                        <span className="text-sm" style={text(colors.textTertiary)}>Video Inputs</span>
                        <div className="text-right space-y-1">
                          {crt.videoInputs.map((input, idx) => (
                            <div key={idx} className="font-medium text-white text-sm">
                              {input.quantity}x {input.connector} - {input.type}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {crt.videoOutputs && crt.videoOutputs.length > 0 && (
                    <div className="py-2 border-b" style={border(colors.border)}>
                      <div className="flex justify-between">
                        <span className="text-sm" style={text(colors.textTertiary)}>Video Outputs</span>
                        <div className="text-right space-y-1">
                          {crt.videoOutputs.map((output, idx) => (
                            <div key={idx} className="font-medium text-white text-sm">
                              {output.quantity}x {output.connector} - {output.type}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {crt.otherIO && crt.otherIO.length > 0 && (
                    <div className="py-2 border-b" style={border(colors.border)}>
                      <div className="flex justify-between">
                        <span className="text-sm" style={text(colors.textTertiary)}>Other I/O</span>
                        <div className="text-right space-y-1">
                          {crt.otherIO.map((io, idx) => (
                            <div key={idx} className="font-medium text-white text-sm">
                              {io.quantity}x {io.connector} - {io.type}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Controls */}
            {hasControlsInfo && (
              <div>
                <h4 className="text-sm uppercase mb-4 font-semibold" style={text(colors.textTertiary)}>Controls</h4>
                <div className="space-y-3">
                  <SpecRow label="On-Screen Display" value={crt.onScreenDisplay !== null ? (crt.onScreenDisplay ? 'Yes' : 'No') : null} />
                  <SpecRow label="Adjustments" value={crt.adjustments} />
                  <SpecRow label="Remote" value={crt.remote} />
                  {crt.serviceMenu && (
                    <div className="py-2 border-b" style={border(colors.border)}>
                      <div className="flex justify-between">
                        <span className="text-sm" style={text(colors.textTertiary)}>Service Menu Access</span>
                        <span className="font-medium text-white text-sm text-right max-w-xs">{crt.serviceMenu}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Internal Components */}
            {hasInternalComponents && (
              <div>
                <h4 className="text-sm uppercase mb-4 font-semibold" style={text(colors.textTertiary)}>Internal Components</h4>
                <div className="space-y-3">
                  <SpecRow label="Horizontal Output Transistor" value={crt.horizontalOutputTransistor} />
                  <SpecRow label="Flyback Transformer" value={crt.flybackTransformer} />
                  <SpecRow label="Vertical Deflection IC" value={crt.verticalDeflectionIC} />
                  <SpecRow label="Jungle IC" value={crt.jungleIC} />
                </div>
              </div>
            )}

            {/* Physical */}
            {hasPhysicalInfo && (
              <div>
                <h4 className="text-sm uppercase mb-4 font-semibold" style={text(colors.textTertiary)}>Physical</h4>
                <div className="space-y-3">
                  {crt.weight && (
                    <SpecRow 
                      label="Weight (lbs, kg)" 
                      value={`${crt.weight.imperial} (${crt.weight.metric})`} 
                    />
                  )}
                  {crt.size && (
                    <SpecRow 
                      label="Size (w×h×d)" 
                      value={`${crt.size.imperial} (${crt.size.metric})`} 
                    />
                  )}
                  {hasValidPower && (
                    <>
                      <SpecRow 
                        label="Power" 
                        value={crt.power
                          .filter(p => p && (p.voltage || p.freq))
                          .map(p => `${p.voltage || ''} ${p.freq || ''}`.trim())
                          .filter(s => s.length > 0)
                          .join(', ') || null} 
                      />
                      <SpecRow 
                        label="Power Consumption" 
                        value={crt.power
                          .filter(p => p && p.watt)
                          .map(p => p.watt)
                          .join(', ') || null} 
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Audio */}
            {hasAudioInfo && (
              <div>
                <h4 className="text-sm uppercase mb-4 font-semibold" style={text(colors.textTertiary)}>Audio</h4>
                <div className="space-y-3">
                  {crt.speakers && (
                    <>
                      <SpecRow label="Speaker Configuration" value={crt.speakers.config} />
                      <SpecRow label="Speaker Wattage" value={crt.speakers.wattage} />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Features */}
            {crt.extraFeatures && (
              <div className="md:col-span-2">
                <h4 className="text-sm uppercase mb-4 font-semibold" style={text(colors.textTertiary)}>Features</h4>
                <div className="py-2 border-b" style={border(colors.border)}>
                  <p className="text-sm" style={text(colors.textSecondary)}>{crt.extraFeatures}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for specification rows
function SpecRow({ label, value }) {
  if (!value && value !== 0 && value !== false) return null;
  
  return (
    <div className="flex justify-between py-2 border-b" style={border(colors.border)}>
      <span className="text-sm" style={text(colors.textTertiary)}>{label}</span>
      <span className="font-medium text-white text-sm text-right max-w-xs">{value}</span>
    </div>
  );
}

export default CrtDetailPage;