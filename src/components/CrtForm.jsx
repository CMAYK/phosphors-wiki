import React, { useState } from 'react';
import { colors, bg, border, text, style } from './colors';
import { manufacturers } from '../data';
import { Save, Plus, X, HelpCircle } from 'lucide-react';
import tooltipsData from './tooltips.json';

function CrtForm({ existingCrt = null, onSave = null, onCancel = null }) {
  const [formData, setFormData] = useState(existingCrt || {
    brand: null,
    manufacturer: null,
    model: null,
    year: null,
    brandSeries: null,
    chassis: null,
    purpose: null,
    purposeType: null,
    market: null,
    hotChassis: null,
    customName: null,
    screenSize: { imperial: null, metric: null },
    tubeSize: { imperial: null, metric: null },
    tubeModel: null,
    tubeType: null,
    tubeTVL: null,
    refreshRate: null,
    maxResolution: null,
    horizontalScanRate: null,
    hasOSD: null,
    hasServiceMenu: null,
    adjustments: null,
    chassis16x9Capable: null,
    horizontalOutputTransistor: null,
    flybackTransformer: null,
    verticalDeflectionIC: null,
    jungleIC: null,
    supportedVideoSystems: [],
    aspectRatio: null,
    tintedTube: false,
    removeableTint: false,
    videoIO: [],
    weight: { imperial: null, metric: null },
    sizeImperial: { width: null, height: null, depth: null },
    sizeMetric: { width: null, height: null, depth: null },
    power: [{ voltage: null, freq: null, watt: null }],
    remote: null,
    launchMSRP: null,
    msrpCurrency: null,
    extraFeatures: null,
    similarModels: [],
    description: null,
    serviceMenu: null,
    speakers: { config: null, wattage: null },
    documentation: [],
    images: []
  });

  const [screenSizeUnit, setScreenSizeUnit] = useState('in');
  const [tubeSizeUnit, setTubeSizeUnit] = useState('in');
  const [weightUnit, setWeightUnit] = useState('lbs');
  const [sizeUnit, setSizeUnit] = useState('in');

  const [newSimilarModel, setNewSimilarModel] = useState('');
  const [numericErrors, setNumericErrors] = useState({});
  const [customInputs, setCustomInputs] = useState({});
  const [customConnectorInputs, setCustomConnectorInputs] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [isCustomResolution, setIsCustomResolution] = useState(false);
  const [hasCustomName, setHasCustomName] = useState(false);
  const [remoteStatus, setRemoteStatus] = useState('no'); // 'yes', 'no', 'unsure'
  const [customResHorizontal, setCustomResHorizontal] = useState('');
  const [customResVertical, setCustomResVertical] = useState('');
  const [customResScanType, setCustomResScanType] = useState('progressive');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleNumericInput = (field, value) => {
    // Check if there are any non-numeric characters (except decimal point)
    const hasLetters = /[^0-9.]/.test(value);
    
    if (hasLetters && value !== '') {
      setNumericErrors(prev => ({ ...prev, [field]: true }));
      return; // Don't update the value
    }
    
    // Clear error if valid
    setNumericErrors(prev => ({ ...prev, [field]: false }));
    handleChange(field, value);
  };

  const handlePowerChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      power: prev.power.map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      )
    }));
  };

  const addToArray = (field, value) => {
    if (value && value.toString().trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
    }
  };

  const removeFromArray = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const toggleVideoSystem = (system) => {
    setFormData(prev => ({
      ...prev,
      supportedVideoSystems: prev.supportedVideoSystems.includes(system)
        ? prev.supportedVideoSystems.filter(s => s !== system)
        : [...prev.supportedVideoSystems, system]
    }));
  };

  const addVideoIO = () => {
    setFormData(prev => ({
      ...prev,
      videoIO: [...prev.videoIO, { 
        category: 'Video',
        quantity: 1, 
        connector: '', 
        type: 'Composite',
        direction: 'input'
      }]
    }));
  };

  const updateVideoIO = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      videoIO: prev.videoIO.map((io, i) => 
        i === index ? { ...io, [field]: value } : io
      )
    }));
  };

  const removeVideoIO = (index) => {
    setFormData(prev => ({
      ...prev,
      videoIO: prev.videoIO.filter((_, i) => i !== index)
    }));
  };

  const handleCustomInput = (ioIndex, value) => {
    setCustomInputs(prev => ({ ...prev, [ioIndex]: value }));
  };

  const handleCustomConnectorInput = (ioIndex, value) => {
    setCustomConnectorInputs(prev => ({ ...prev, [ioIndex]: value }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check for any numeric errors
    const hasErrors = Object.values(numericErrors).some(error => error === true);
    if (hasErrors) {
      alert('Please fix all numeric field errors before submitting.');
      return;
    }
    
    // Format custom resolution if "Custom" is selected
    let finalMaxResolution = formData.maxResolution;
    if (formData.maxResolution === 'Custom' && customResHorizontal && customResVertical) {
      const scanTypeCode = customResScanType === 'progressive' ? 'p' : 'i';
      finalMaxResolution = `${customResHorizontal}×${customResVertical}${scanTypeCode}`;
    }
    
    // Determine remote value based on status
    let finalRemote;
    if (remoteStatus === 'yes') {
      finalRemote = formData.remote;
    } else if (remoteStatus === 'unsure') {
      finalRemote = 'Unconfirmed';
    } else {
      finalRemote = 'No remote';
    }
    
    const newCrt = {
      ...formData,
      id: existingCrt ? existingCrt.id : Date.now(),
      year: formData.year ? parseInt(formData.year) : null,
      tubeTVL: formData.tubeTVL ? parseInt(formData.tubeTVL) : null,
      launchMSRP: formData.launchMSRP ? parseInt(formData.launchMSRP) : null,
      remote: finalRemote,
      maxResolution: finalMaxResolution,
      videoIO: formData.videoIO ? formData.videoIO.filter(io => io !== null).map((io, idx) => ({
        ...io,
        type: io.type === 'Other' ? customInputs[idx] || 'Other' : io.type,
        connector: io.connector === 'Other' ? customConnectorInputs[idx] || 'Other' : io.connector
      })) : []
    };

    try {
      const url = existingCrt 
        ? `http://localhost:3001/api/crts/${existingCrt.id}`
        : 'http://localhost:3001/api/crts';
      
      const method = existingCrt ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCrt),
      });

      if (!response.ok) {
        throw new Error('Failed to save CRT');
      }

      const result = await response.json();
      
      // Upload images if any were selected
      if (selectedImages.length > 0) {
        const formDataObj = new FormData();
        selectedImages.forEach(file => {
          formDataObj.append('images', file);
        });
        
        try {
          const imageResponse = await fetch(`http://localhost:3001/api/crts/${result.crt.id}/images`, {
            method: 'POST',
            body: formDataObj,
          });
          
          if (!imageResponse.ok) {
            throw new Error('Failed to upload images');
          }
          
          alert(`CRT ${existingCrt ? 'updated' : 'added'} successfully with ${selectedImages.length} image(s)!`);
        } catch (imageError) {
          console.error('Error uploading images:', imageError);
          alert(`CRT saved but failed to upload images: ${imageError.message}`);
        }
      } else {
        alert(`CRT ${existingCrt ? 'updated' : 'added'} successfully!`);
      }
      
      if (onSave) {
        onSave(result.crt);
      }
      
      // Reset form if adding new
      if (!existingCrt) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving CRT:', error);
      alert('Failed to save CRT. Make sure the server is running.');
    }
  };
const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;
    
    // Validate file sizes (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      alert(`The following files are too large (max 10MB):\n${oversizedFiles.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`).join('\n')}`);
      return;
    }
    
    // Store the actual files
    setSelectedImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleImageDelete = (index) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    // Remove from selected images
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    
    // Revoke and remove preview URL
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const purposeOptions = [
    'Professional',
    'Consumer',
    'Broadcast',
    'Medical',
    'Portable'
  ];

  const maskTypeOptions = [
    'No Mask (Black and White)',
    'Shadow Mask (Slot)',
    'Shadow Mask (Dot)',
    'Aperture Grille',
    'Beam-Shadowing Mask'
  ];

  const resolutionOptions = [
    '240p/480i',
    '480p',
    '720i',
    '720p',
    '1080i',
    '1080p',
    '1440i',
    'Custom'
  ];

  const videoSystemOptions = [
    'NTSC',
    'PAL',
    'SECAM',
    'NTSC4.43',
    'PAL-60',
    'PAL-M',
    'SECAM-M'
  ];

  const ioCategoryOptions = ['Video', 'Audio', 'Other'];

  const connectorTypeOptions = [
    'BNC',
    'Belling-Lee',
    'DB-13W3',
    'DB-15',
    'DB-9',
    'DIN',
    'D端子 (D-Terminal)',
    'EIAJ-D8A2 / EIAJ-8',
    'F-Type',
    'HD-15 (VGA)',
    'HDMI',
    'Mini-DIN',
    'Quick F-Type',
    'RCA / Cinch',
    'SCART / EIAJ TTC-003',
    'Sony A/V Hit / A/V Uniconnector',
    'Twin-Leads (Screws/Forks)',
    '34-pin IDC (2x17)',
    '3.5mm TRS',
    '6.3mm TRS',
    'Other'
    ]

  const videoTypeOptions = [
    'RGBS',
    'RGBHV',
    'RGsB',
    'Component',
    'Composite',
    'S-Video (Luma + Chroma)',
    'RF (UHF + VHF)',
    'CGA',
    'EGA',
    'MDA',
    'SVGA',
    'XGA',
    'HDMI',
    'Other'
  ];

  const audioTypeOptions = [
    'RCA Stereo',
    'RCA Mono',
    '3.5mm',
    'XLR',
    'Optical',
    'Other'
  ];

  const otherTypeOptions = ['Serial', 'USB', 'Ethernet', 'Other'];

  const currencyOptions = [
    { code: 'USD', symbol: '$', label: '$ (USD)' },
    { code: 'EUR', symbol: '€', label: '€ (EUR)' },
    { code: 'GBP', symbol: '£', label: '£ (GBP)' },
    { code: 'JPY', symbol: '¥', label: '¥ (JPY)' },
    { code: 'CAD', symbol: '$', label: '$ (CAD)' },
    { code: 'AUD', symbol: '$', label: '$ (AUD)' },
    { code: 'CHF', symbol: 'Fr', label: 'Fr (CHF)' },
    { code: 'CNY', symbol: '¥', label: '¥ (CNY)' },
    { code: 'SEK', symbol: 'kr', label: 'kr (SEK)' },
    { code: 'NZD', symbol: '$', label: '$ (NZD)' }
  ];

  const voltageOptions = [
    '100V', '110V', '115V', '120V', '127V', '220V', '230V', '240V', 'Multivoltage'
  ];

  const Tooltip = ({ fieldName }) => {
    const tooltipText = tooltipsData[fieldName];
    
    if (!tooltipText) {
      return null;
    }
    
    // Split text by periods and add line breaks after sentences
    const formattedText = tooltipText.split('. ').map((sentence, index, array) => (
      <span key={index}>
        {sentence}{index < array.length - 1 ? '.' : ''}{index < array.length - 1 && <br />}
      </span>
    ));
    
    return (
      <div className="relative inline-block ml-1 group">
        <HelpCircle size={14} style={text(colors.textTertiary)} className="cursor-help" />
        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block p-2 rounded text-xs transition-opacity delay-1000"
             style={style(bg(colors.cardBg), border(colors.border), text(colors.textSecondary), { border: '1px dotted', whiteSpace: 'nowrap' })}>
          {formattedText}
        </div>
      </div>
    );
  };

  const Toggle = ({ value, onChange, option1, option2 }) => (
    <div className="inline-flex rounded border h-[42px]" style={border(colors.border)}>
      <button
        type="button"
        onClick={() => onChange(option1.value)}
        className={`px-3 py-2 text-sm transition-colors ${value === option1.value ? 'text-white' : ''}`}
        style={value === option1.value ? bg(colors.interactive) : text(colors.textTertiary)}
      >
        {option1.label}
      </button>
      <button
        type="button"
        onClick={() => onChange(option2.value)}
        className={`px-3 py-2 text-sm transition-colors ${value === option2.value ? 'text-white' : ''}`}
        style={value === option2.value ? bg(colors.interactive) : text(colors.textTertiary)}
      >
        {option2.label}
      </button>
    </div>
  );

  const TriToggle = ({ value, onChange, option1, option2, option3 }) => (
    <div className="inline-flex rounded border h-[42px]" style={border(colors.border)}>
      <button
        type="button"
        onClick={() => onChange(option1.value)}
        className={`px-3 py-2 text-sm transition-colors ${value === option1.value ? 'text-white' : ''}`}
        style={value === option1.value ? bg(colors.interactive) : text(colors.textTertiary)}
      >
        {option1.label}
      </button>
      <button
        type="button"
        onClick={() => onChange(option2.value)}
        className={`px-3 py-2 text-sm transition-colors ${value === option2.value ? 'text-white' : ''}`}
        style={value === option2.value ? bg(colors.interactive) : text(colors.textTertiary)}
      >
        {option2.label}
      </button>
      <button
        type="button"
        onClick={() => onChange(option3.value)}
        className={`px-3 py-2 text-sm transition-colors ${value === option3.value ? 'text-white' : ''}`}
        style={value === option3.value ? bg(colors.interactive) : text(colors.textTertiary)}
      >
        {option3.label}
      </button>
    </div>
  );

  // Conversion functions with rounding at 0.95
  const convertInchesToCm = (inches) => {
    const num = parseFloat(inches);
    if (isNaN(num)) return '';
    const converted = num * 2.54;
    const decimal = converted - Math.floor(converted);
    return decimal >= 0.95 ? Math.ceil(converted).toFixed(2) : converted.toFixed(2);
  };

  const convertCmToInches = (cm) => {
    const num = parseFloat(cm);
    if (isNaN(num)) return '';
    const converted = num / 2.54;
    const decimal = converted - Math.floor(converted);
    return decimal >= 0.95 ? Math.ceil(converted).toFixed(2) : converted.toFixed(2);
  };

  const convertLbsToKg = (lbs) => {
    const num = parseFloat(lbs);
    if (isNaN(num)) return '';
    const converted = num * 0.453592;
    const decimal = converted - Math.floor(converted);
    return decimal >= 0.95 ? Math.ceil(converted).toFixed(2) : converted.toFixed(2);
  };

  const convertKgToLbs = (kg) => {
    const num = parseFloat(kg);
    if (isNaN(num)) return '';
    const converted = num / 0.453592;
    const decimal = converted - Math.floor(converted);
    return decimal >= 0.95 ? Math.ceil(converted).toFixed(2) : converted.toFixed(2);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="rounded p-6 border" style={style(bg(colors.cardBg), border(colors.border))}>
        <h3 className="text-2xl font-bold text-white mb-6">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Brand <span style={{ color: '#ef4444' }}>*</span>
              <Tooltip fieldName="brand" />
            </label>
            <input
              required
              type="text"
              value={formData.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., Sony"
              list="brand-suggestions"
            />
            <datalist id="brand-suggestions">
              {manufacturers.map(m => (
                <option key={m.id} value={m.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Model <span style={{ color: '#ef4444' }}>*</span>
              <Tooltip fieldName="model" />
            </label>
            <input
              required
              type="text"
              value={formData.model}
              onChange={(e) => handleChange('model', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., PVM-20L5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Manufacturer
              <Tooltip fieldName="manufacturer" />
            </label>
            <input
              type="text"
              value={formData.manufacturer}
              onChange={(e) => handleChange('manufacturer', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., Sony Corporation"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Year
              <Tooltip fieldName="year" />
              {numericErrors.year && (
                <span className="ml-auto text-xs text-red-400">
                  Only numerical values allowed
                </span>
              )}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.year}
              onChange={(e) => handleNumericInput('year', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., 2004"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Purpose <span style={{ color: '#ef4444' }}>*</span>
              <Tooltip fieldName="purpose" />
            </label>
            <select
              value={formData.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
            >
              <option value="">Select...</option>
              {purposeOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Type
              <Tooltip fieldName="purposeType" />
            </label>
            <Toggle
              value={formData.purposeType}
              onChange={(val) => handleChange('purposeType', val)}
              option1={{ label: 'TV', value: 'TV' }}
              option2={{ label: 'Monitor', value: 'Monitor' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Brand Series
              <Tooltip fieldName="brandSeries" />
            </label>
            <input
              type="text"
              value={formData.brandSeries}
              onChange={(e) => handleChange('brandSeries', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., PVM, Trinitron"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Market
              <Tooltip fieldName="market" />
            </label>
            <input
              type="text"
              value={formData.market}
              onChange={(e) => handleChange('market', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., Global, North America, Japan"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
            Description <span style={{ color: '#ef4444' }}>*</span>
              <Tooltip fieldName="description" />
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 rounded border text-white"
            style={style(bg(colors.darkBg), border(colors.border))}
            placeholder="Brief description of the CRT..."
          />
        </div>

        {/* Hot Chassis Checkbox */}
        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.hotChassis}
              onChange={(e) => handleChange('hotChassis', e.target.checked)}
              className="w-4 h-4"
            />
            <span style={text(colors.textSecondary)}>Hot Chassis (Safety Warning)</span>
            <Tooltip fieldName="hotChassis" />
          </label>
        </div>

        {/* Custom Name */}
        <div className="mt-4">
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={hasCustomName}
              onChange={(e) => {
                setHasCustomName(e.target.checked);
                if (!e.target.checked) {
                  handleChange('customName', null);
                }
              }}
              className="w-4 h-4"
            />
            <span style={text(colors.textSecondary)}>Custom Name</span>
            <Tooltip fieldName="customName" />
          </label>
          <input
            type="text"
            value={formData.customName}
            onChange={(e) => handleChange('customName', e.target.value)}
            disabled={!hasCustomName}
            className="w-full px-4 py-2 rounded border text-white"
            style={style(
              bg(hasCustomName ? colors.darkBg : colors.cardBg), 
              border(colors.border),
              hasCustomName ? {} : { opacity: 0.5, cursor: 'not-allowed' }
            )}
            placeholder="e.g., My Gaming CRT"
          />
        </div>
      </div>

      {/* Upload Images Section - Moved here */}
      <div className="rounded p-6 border" style={style(bg(colors.cardBg), border(colors.border))}>
        <h3 className="text-2xl font-bold text-white mb-6">Upload Images</h3>
        
        <div className="space-y-4">
          {/* Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Upload Images
              <Tooltip fieldName="images" />
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
            />
            <p className="text-xs mt-1" style={text(colors.textTertiary)}>
              Max 10 images, 10MB each. Formats: JPG, PNG, GIF, WebP
            </p>
          </div>

          {/* Image Preview Grid */}
          {imagePreviewUrls.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
                Selected Images ({imagePreviewUrls.length})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviewUrls.map((url, idx) => (
                  <div key={idx} className="relative group aspect-square rounded overflow-hidden border" style={border(colors.border)}>
                    <img
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageDelete(idx)}
                      className="absolute top-2 right-2 p-1 rounded bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                      Image {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Display Specifications */}
      <div className="rounded p-6 border" style={style(bg(colors.cardBg), border(colors.border))}>
        <h3 className="text-2xl font-bold text-white mb-6">Display Specifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Screen Size */}
          <div>
            <label className="flex items-center text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              <span>Screen Size <span style={{ color: '#ef4444' }}>*</span></span>
              <Tooltip fieldName="screenSize" />
              {numericErrors.screenSize && (
                <span className="ml-auto text-xs text-red-400">
                  Only numerical values allowed
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="decimal"
                value={screenSizeUnit === 'in' ? formData.screenSize.imperial : formData.screenSize.metric}
                onChange={(e) => {
                  handleNumericInput('screenSize', e.target.value);
                  if (!numericErrors.screenSize) {
                    if (screenSizeUnit === 'in') {
                      handleNestedChange('screenSize', 'imperial', e.target.value);
                      handleNestedChange('screenSize', 'metric', convertInchesToCm(e.target.value));
                    } else {
                      handleNestedChange('screenSize', 'metric', e.target.value);
                      handleNestedChange('screenSize', 'imperial', convertCmToInches(e.target.value));
                    }
                  }
                }}
                className="flex-1 px-4 py-2 rounded border text-white"
                style={style(bg(colors.darkBg), border(colors.border))}
                placeholder="e.g., 20"
              />
              <Toggle
                value={screenSizeUnit}
                onChange={(val) => setScreenSizeUnit(val)}
                option1={{ label: 'in', value: 'in' }}
                option2={{ label: 'cm', value: 'cm' }}
              />
            </div>
            {screenSizeUnit === 'in' && formData.screenSize.metric && (
              <p className="text-xs mt-1" style={text(colors.textTertiary)}>
                ≈ {formData.screenSize.metric} cm
              </p>
            )}
            {screenSizeUnit === 'cm' && formData.screenSize.imperial && (
              <p className="text-xs mt-1" style={text(colors.textTertiary)}>
                ≈ {formData.screenSize.imperial} in
              </p>
            )}
          </div>

          {/* Tube Size */}
          <div>
            <label className="flex items-center text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Tube Size
              <Tooltip fieldName="tubeSize" />
              {numericErrors.tubeSize && (
                <span className="ml-auto text-xs text-red-400">
                  Only numerical values allowed
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="decimal"
                value={tubeSizeUnit === 'in' ? formData.tubeSize.imperial : formData.tubeSize.metric}
                onChange={(e) => {
                  handleNumericInput('tubeSize', e.target.value);
                  if (!numericErrors.tubeSize) {
                    if (tubeSizeUnit === 'in') {
                      handleNestedChange('tubeSize', 'imperial', e.target.value);
                      handleNestedChange('tubeSize', 'metric', convertInchesToCm(e.target.value));
                    } else {
                      handleNestedChange('tubeSize', 'metric', e.target.value);
                      handleNestedChange('tubeSize', 'imperial', convertCmToInches(e.target.value));
                    }
                  }
                }}
                className="flex-1 px-4 py-2 rounded border text-white"
                style={style(bg(colors.darkBg), border(colors.border))}
                placeholder="e.g., 21"
              />
              <Toggle
                value={tubeSizeUnit}
                onChange={(val) => setTubeSizeUnit(val)}
                option1={{ label: 'in', value: 'in' }}
                option2={{ label: 'cm', value: 'cm' }}
              />
            </div>
            {tubeSizeUnit === 'in' && formData.tubeSize.metric && (
              <p className="text-xs mt-1" style={text(colors.textTertiary)}>
                ≈ {formData.tubeSize.metric} cm
              </p>
            )}
            {tubeSizeUnit === 'cm' && formData.tubeSize.imperial && (
              <p className="text-xs mt-1" style={text(colors.textTertiary)}>
                ≈ {formData.tubeSize.imperial} in
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Tube Model
              <Tooltip fieldName="model" />
            </label>
            <input
              type="text"
              value={formData.tubeModel}
              onChange={(e) => handleChange('tubeModel', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., A-68AHB22X"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Mask Type
              <Tooltip fieldName="purposeType" />
            </label>
            <select
              value={formData.tubeType}
              onChange={(e) => handleChange('tubeType', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
            >
              <option value="">Select...</option>
              {maskTypeOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              TVL (TV Lines)
              <Tooltip fieldName="tubeTVL" />
              {numericErrors.tubeTVL && (
                <span className="ml-auto text-xs text-red-400">
                  Only numerical values allowed
                </span>
              )}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.tubeTVL}
              onChange={(e) => handleNumericInput('tubeTVL', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., 800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Aspect Ratio <span style={{ color: '#ef4444' }}>*</span>
              <Tooltip fieldName="aspectRatio" />
            </label>
            <select
              value={formData.aspectRatio}
              onChange={(e) => handleChange('aspectRatio', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
            >
              <option value="">Select...</option>
              <option value="4:3">4:3</option>
              <option value="16:9">16:9</option>
              <option value="16:10">16:10</option>
              <option value="5:4">5:4</option>
            </select>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Maximum Refresh Rate (Hz)
              <Tooltip fieldName="refreshRate" />
              {numericErrors.refreshRate && (
                <span className="ml-auto text-xs text-red-400">
                  Only numerical values allowed
                </span>
              )}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.refreshRate}
              onChange={(e) => handleNumericInput('refreshRate', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., 60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Horizontal Scan Rate
              <Tooltip fieldName="horizontalScanRate" />
            </label>
            <input
              type="text"
              value={formData.horizontalScanRate}
              onChange={(e) => handleChange('horizontalScanRate', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., 15-45 kHz"
            />
          </div>
        </div>

        {/* Max Resolution */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-4" style={text(colors.textSecondary)}>
            Max Resolution
              <Tooltip fieldName="maxResolution" />
          </label>
          <select
            value={formData.maxResolution}
            onChange={(e) => {
              handleChange('maxResolution', e.target.value);
              setIsCustomResolution(e.target.value === 'Custom');
            }}
            className="w-full px-4 py-2 rounded border text-white mb-4"
            style={style(bg(colors.darkBg), border(colors.border))}
          >
            <option value="">Select...</option>
            {resolutionOptions.map(res => (
              <option key={res} value={res}>{res}</option>
            ))}
          </select>

          {/* Custom Resolution Fields */}
          <div>
            <label className="block text-xs font-medium mb-2" style={text(isCustomResolution ? colors.textSecondary : colors.textDisabled)}>
              Custom Resolution
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={text(isCustomResolution ? colors.textSecondary : colors.textDisabled)}>
                  Horizontal
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={customResHorizontal}
                  onChange={(e) => setCustomResHorizontal(e.target.value)}
                  disabled={!isCustomResolution}
                  className="w-full px-4 py-2 rounded border text-white"
                  style={style(
                    bg(isCustomResolution ? colors.darkBg : colors.cardBg), 
                    border(colors.border),
                    isCustomResolution ? {} : { opacity: 0.5, cursor: 'not-allowed' }
                  )}
                  placeholder="e.g., 1920"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={text(isCustomResolution ? colors.textSecondary : colors.textDisabled)}>
                  Vertical
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={customResVertical}
                  onChange={(e) => setCustomResVertical(e.target.value)}
                  disabled={!isCustomResolution}
                  className="w-full px-4 py-2 rounded border text-white"
                  style={style(
                    bg(isCustomResolution ? colors.darkBg : colors.cardBg), 
                    border(colors.border),
                    isCustomResolution ? {} : { opacity: 0.5, cursor: 'not-allowed' }
                  )}
                  placeholder="e.g., 1080"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={text(isCustomResolution ? colors.textSecondary : colors.textDisabled)}>
                  Scan Type
                </label>
                <div style={isCustomResolution ? {} : { opacity: 0.5, pointerEvents: 'none' }}>
                  <Toggle
                    value={customResScanType}
                    onChange={(val) => setCustomResScanType(val)}
                    option1={{ label: 'Progressive', value: 'progressive' }}
                    option2={{ label: 'Interlaced', value: 'interlaced' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Video Systems as Cards */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-4" style={text(colors.textSecondary)}>
            Supported Video Systems
              <Tooltip fieldName="supportedVideoSystems" />
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {videoSystemOptions.map(sys => (
              <button
                key={sys}
                type="button"
                onClick={() => toggleVideoSystem(sys)}
                className={`px-3 py-2 rounded border text-sm transition-colors ${
                  formData.supportedVideoSystems.includes(sys) ? 'text-white' : ''
                }`}
                style={formData.supportedVideoSystems.includes(sys) 
                  ? style(bg(colors.interactive), border(colors.interactive))
                  : style(bg(colors.darkBg), border(colors.border), text(colors.textTertiary))
                }
              >
                {sys}
              </button>
            ))}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="mt-6 space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.tintedTube}
              onChange={(e) => {
                handleChange('tintedTube', e.target.checked);
                // Clear removeable tint if untinting
                if (!e.target.checked) {
                  handleChange('removeableTint', false);
                }
              }}
              className="w-4 h-4"
            />
            <span style={text(colors.textSecondary)}>Has Tint</span>
            <Tooltip fieldName="tintedTube" />
          </label>
          <label className="flex items-center gap-2 ml-6">
            <input
              type="checkbox"
              checked={formData.removeableTint}
              onChange={(e) => handleChange('removeableTint', e.target.checked)}
              disabled={!formData.tintedTube}
              className="w-4 h-4"
            />
            <span style={text(formData.tintedTube ? colors.textSecondary : colors.textDisabled)}>
              Removeable Tint
            </span>
            <Tooltip fieldName="removeableTint" />
          </label>
        </div>
      </div>

      {/* Video/Audio I/O */}
      <div className="rounded p-6 border" style={style(bg(colors.cardBg), border(colors.border))}>
        <h3 className="text-2xl font-bold text-white mb-6">Video/Audio I/O</h3>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium" style={text(colors.textSecondary)}>
              Inputs & Outputs <span style={{ color: '#ef4444' }}>*</span>
              <Tooltip fieldName="videoIO" />
            </label>
            <button
              type="button"
              onClick={addVideoIO}
              className="px-3 py-1 rounded text-white flex items-center gap-2"
              style={bg(colors.interactive)}
            >
              <Plus size={16} />
              Add I/O
            </button>
          </div>
          
          {/* Column Headers */}
          {formData.videoIO && formData.videoIO.length > 0 && (
            <div className="grid grid-cols-12 gap-2 mb-2 px-4">
              <div className="col-span-2 text-xs font-medium" style={text(colors.textTertiary)}>I/O Type</div>
              <div className="col-span-1 text-xs font-medium" style={text(colors.textTertiary)}>Qty</div>
              <div className="col-span-3 text-xs font-medium" style={text(colors.textTertiary)}>Connector</div>
              <div className="col-span-3 text-xs font-medium" style={text(colors.textTertiary)}>Video Signal Type</div>
              <div className="col-span-2 text-xs font-medium" style={text(colors.textTertiary)}>Direction</div>
              <div className="col-span-1"></div>
            </div>
          )}
          
          <div className="space-y-3">
            {formData.videoIO && formData.videoIO.length > 0 && formData.videoIO.map((io, idx) => {
              if (!io) return null; // Add this safety check
              
              const typeOptions = io.category === 'Video' ? videoTypeOptions 
                                : io.category === 'Audio' ? audioTypeOptions 
                                : otherTypeOptions;
              const showCustomInput = io.type === 'Other';

              return (
                <div key={idx} className="p-4 rounded border" style={style(bg(colors.darkBg), border(colors.border))}>
                  <div className="grid grid-cols-12 gap-2">
                    {/* Category Dropdown */}
                    <select
                      value={io.category}
                      onChange={(e) => {
                        updateVideoIO(idx, 'category', e.target.value);
                        updateVideoIO(idx, 'type', 'Composite');
                      }}
                      className="col-span-2 px-2 py-2 rounded border text-white text-sm"
                      style={style(bg(colors.cardBg), border(colors.border))}
                    >
                      {ioCategoryOptions.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    {/* Quantity */}
                    <input
                      type="number"
                      value={io.quantity}
                      onChange={(e) => updateVideoIO(idx, 'quantity', parseInt(e.target.value) || 1)}
                      className="col-span-1 px-2 py-2 rounded border text-white text-sm"
                      style={style(bg(colors.cardBg), border(colors.border))}
                      placeholder="Qty"
                      min="1"
                    />

                    {/* Connector Dropdown */}
                    <select
                      value={io.connector}
                      onChange={(e) => updateVideoIO(idx, 'connector', e.target.value)}
                      className="col-span-3 px-2 py-2 rounded border text-white text-sm"
                      style={style(bg(colors.cardBg), border(colors.border))}
                    >
                      <option value="">Select...</option>
                      {connectorTypeOptions.map(conn => (
                        <option key={conn} value={conn}>{conn}</option>
                      ))}
                    </select>

                    {/* Type Dropdown */}
                    <select
                      value={io.type}
                      onChange={(e) => updateVideoIO(idx, 'type', e.target.value)}
                      className="col-span-3 px-2 py-2 rounded border text-white text-sm"
                      style={style(bg(colors.cardBg), border(colors.border))}
                    >
                      {typeOptions.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>

                    {/* Direction Toggle */}
                    <div className="col-span-2 flex items-center">
                      <Toggle
                        value={io.direction}
                        onChange={(val) => updateVideoIO(idx, 'direction', val)}
                        option1={{ label: 'In', value: 'input' }}
                        option2={{ label: 'Out', value: 'output' }}
                      />
                    </div>

                    {/* Remove IO Button */}
                    <button
                      type="button"
                      onClick={() => removeVideoIO(idx)}
                      className="col-span-1 px-2 py-2 rounded text-red-400 hover:bg-red-900/20"
                      style={border(colors.border)}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Custom Input for "Other" Type */}
                  {showCustomInput && (
                    <div className="mt-2">
                      <label className="block text-xs font-medium mb-1" style={text(colors.textTertiary)}>User-Defined Video Signal Type</label>
                      <input
                        type="text"
                        value={customInputs[idx] || ''}
                        onChange={(e) => handleCustomInput(idx, e.target.value)}
                        className="w-full px-3 py-2 rounded border text-white text-sm"
                        style={style(bg(colors.cardBg), border(colors.border))}
                        placeholder="Specify custom type..."
                      />
                    </div>
                  )}
                  
                  {/* Custom Input for "Other" Connector */}
                  {io.connector === 'Other' && (
                    <div className="mt-2">
                      <label className="block text-xs font-medium mb-1" style={text(colors.textTertiary)}>User-Defined Connector</label>
                      <input
                        type="text"
                        value={customConnectorInputs[idx] || ''}
                        onChange={(e) => handleCustomConnectorInput(idx, e.target.value)}
                        className="w-full px-3 py-2 rounded border text-white text-sm"
                        style={style(bg(colors.cardBg), border(colors.border))}
                        placeholder="Specify custom connector (e.g., BNC, RCA)..."
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controls & OSD */}
      <div className="rounded p-6 border" style={style(bg(colors.cardBg), border(colors.border))}>
        <h3 className="text-2xl font-bold text-white mb-6">Controls & Adjustments</h3>
        
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.hasOSD}
              onChange={(e) => handleChange('hasOSD', e.target.checked)}
              className="w-4 h-4"
            />
            <span style={text(colors.textSecondary)}>Has OSD (On-Screen Display)</span>
            <Tooltip fieldName="hasOSD" />
          </label>

          <label className="flex items-center gap-2 ml-6">
            <input
              type="checkbox"
              checked={formData.hasServiceMenu}
              onChange={(e) => handleChange('hasServiceMenu', e.target.checked)}
              disabled={!formData.hasOSD}
              className="w-4 h-4"
            />
            <span style={text(formData.hasOSD ? colors.textSecondary : colors.textDisabled)}>
              Has Service Menu
            </span>
            <Tooltip fieldName="hasServiceMenu" />
          </label>

          <div className="ml-6">
            <label className="block text-sm font-medium mb-2" style={text(formData.hasOSD ? colors.textSecondary : colors.textDisabled)}>
              How to access service menu
              <Tooltip fieldName="serviceMenu" />
            </label>
            <input
              type="text"
              value={formData.serviceMenu}
              onChange={(e) => handleChange('serviceMenu', e.target.value)}
              disabled={!formData.hasOSD}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(
                bg(formData.hasOSD ? colors.darkBg : colors.cardBg), 
                border(colors.border),
                formData.hasOSD ? {} : { opacity: 0.5, cursor: 'not-allowed' }
              )}
              placeholder="e.g., Press MENU + DEGAUSS simultaneously"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.chassis16x9Capable}
              onChange={(e) => handleChange('chassis16x9Capable', e.target.checked)}
              className="w-4 h-4"
            />
            <span style={text(colors.textSecondary)}>TV has 16:9 mode?</span>
            <Tooltip fieldName="chassis16x9Capable" />
          </label>

          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Adjustments
              <Tooltip fieldName="adjustments" />
            </label>
            <input
              type="text"
              value={formData.adjustments}
              onChange={(e) => handleChange('adjustments', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., Digital, Analog, Front Panel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Shipped with a remote controller?
            </label>
            <div className="inline-flex rounded border mb-3" style={border(colors.border)}>
              <button
                type="button"
                onClick={() => {
                  setRemoteStatus('yes');
                }}
                className={`px-4 py-2 text-sm transition-colors ${remoteStatus === 'yes' ? 'text-white' : ''}`}
                style={remoteStatus === 'yes' ? bg(colors.interactive) : text(colors.textTertiary)}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => {
                  setRemoteStatus('no');
                  handleChange('remote', null);
                }}
                className={`px-4 py-2 text-sm transition-colors ${remoteStatus === 'no' ? 'text-white' : ''}`}
                style={remoteStatus === 'no' ? bg(colors.interactive) : Object.assign({}, text(colors.textTertiary), border(colors.border))}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => {
                  setRemoteStatus('unsure');
                  handleChange('remote', null);
                }}
                className={`px-4 py-2 text-sm transition-colors ${remoteStatus === 'unsure' ? 'text-white' : ''}`}
                style={remoteStatus === 'unsure' ? bg(colors.interactive) : text(colors.textTertiary)}
              >
                Unsure
              </button>
            </div>
            <label className="block text-sm font-medium mb-2" style={text(remoteStatus === 'yes' ? colors.textSecondary : colors.textDisabled)}>
              Remote Control
              <Tooltip fieldName="remote" />
            </label>
            <input
              type="text"
              value={formData.remote || ''}
              onChange={(e) => handleChange('remote', e.target.value)}
              disabled={remoteStatus !== 'yes'}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(remoteStatus === 'yes' ? colors.darkBg : colors.cardBg), border(colors.border), remoteStatus === 'yes' ? {} : { color: colors.textDisabled })}
              placeholder="e.g., RM-M7G"
            />
          </div>

          {/* Speaker Configuration */}
          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Speaker Configuration
              <Tooltip fieldName="speakers" />
            </label>
            <input
              type="text"
              value={formData.speakers.config}
              onChange={(e) => handleNestedChange('speakers', 'config', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., 2x Stereo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Speaker Wattage
              <Tooltip fieldName="speakers" />
            </label>
            <input
              type="text"
              value={formData.speakers.wattage}
              onChange={(e) => handleNestedChange('speakers', 'wattage', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., 10W"
            />
          </div>
        </div>
      </div>

      {/* Technical Components */}
      <div className="rounded p-6 border" style={style(bg(colors.cardBg), border(colors.border))}>
        <h3 className="text-2xl font-bold text-white mb-6">Internal Components</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Chassis
              <Tooltip fieldName="chassis" />
            </label>
            <input
              type="text"
              value={formData.chassis}
              onChange={(e) => handleChange('chassis', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., BA-5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Horizontal Output Transistor
              <Tooltip fieldName="horizontalOutputTransistor" />
            </label>
            <input
              type="text"
              value={formData.horizontalOutputTransistor}
              onChange={(e) => handleChange('horizontalOutputTransistor', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., C5386"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Flyback Transformer
              <Tooltip fieldName="flybackTransformer" />
            </label>
            <input
              type="text"
              value={formData.flybackTransformer}
              onChange={(e) => handleChange('flybackTransformer', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., FTK14A006"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Vertical Deflection IC
              <Tooltip fieldName="verticalDeflectionIC" />
            </label>
            <input
              type="text"
              value={formData.verticalDeflectionIC}
              onChange={(e) => handleChange('verticalDeflectionIC', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., LA7830"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Jungle IC
              <Tooltip fieldName="jungleIC" />
            </label>
            <input
              type="text"
              value={formData.jungleIC}
              onChange={(e) => handleChange('jungleIC', e.target.value)}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., CXA2025AS"
            />
          </div>
        </div>

        {/* Power Information */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-4" style={text(colors.textSecondary)}>
            Power Information
            <Tooltip fieldName="power" />
          </label>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={text(colors.textTertiary)}>
                Voltage
              </label>
              <select
                value={formData.power[0].voltage}
                onChange={(e) => handlePowerChange(0, 'voltage', e.target.value)}
                className="w-full px-4 py-2 rounded border text-white"
                style={style(bg(colors.darkBg), border(colors.border))}
              >
                <option value="">Select...</option>
                {voltageOptions.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-2" style={text(colors.textTertiary)}>
                Voltage Frequency
              </label>
              <TriToggle
                value={formData.power[0].freq}
                onChange={(val) => handlePowerChange(0, 'freq', val)}
                option1={{ label: '50Hz', value: '50Hz' }}
                option2={{ label: '60Hz', value: '60Hz' }}
                option3={{ label: '50/60Hz', value: '50/60Hz' }}
              />
            </div>
          </div>
          
          <div>
            <label className="flex items-center text-xs font-medium mb-2" style={text(colors.textTertiary)}>
              Wattage
              {numericErrors.wattage && (
                <span className="ml-auto text-xs text-red-400">
                  Numbers only
                </span>
              )}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.power[0].watt}
              onChange={(e) => {
                handleNumericInput('wattage', e.target.value);
                if (!numericErrors.wattage) {
                  handlePowerChange(0, 'watt', e.target.value);
                }
              }}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., 120"
            />
          </div>
        </div>
      </div>

      {/* Physical Specifications */}
      <div className="rounded p-6 border" style={style(bg(colors.cardBg), border(colors.border))}>
        <h3 className="text-2xl font-bold text-white mb-6">Physical Specifications</h3>
        
        {/* Weight */}
        <div className="mb-6">
          <label className="flex items-center text-sm font-medium mb-2" style={text(colors.textSecondary)}>
            Weight
              <Tooltip fieldName="weight" />
            {numericErrors.weight && (
              <span className="ml-auto text-xs text-red-400">
                Only numerical values allowed
              </span>
            )}
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              inputMode="decimal"
              value={weightUnit === 'lbs' ? formData.weight.imperial : formData.weight.metric}
              onChange={(e) => {
                handleNumericInput('weight', e.target.value);
                if (!numericErrors.weight) {
                  if (weightUnit === 'lbs') {
                    handleNestedChange('weight', 'imperial', e.target.value);
                    handleNestedChange('weight', 'metric', convertLbsToKg(e.target.value));
                  } else {
                    handleNestedChange('weight', 'metric', e.target.value);
                    handleNestedChange('weight', 'imperial', convertKgToLbs(e.target.value));
                  }
                }
              }}
              className="flex-1 px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="Weight"
            />
            <Toggle
              value={weightUnit}
              onChange={(val) => setWeightUnit(val)}
              option1={{ label: 'lbs', value: 'lbs' }}
              option2={{ label: 'kg', value: 'kg' }}
            />
          </div>
          {weightUnit === 'lbs' && formData.weight.metric && (
            <p className="text-xs mt-1" style={text(colors.textTertiary)}>
              ≈ {formData.weight.metric} kg
            </p>
          )}
          {weightUnit === 'kg' && formData.weight.imperial && (
            <p className="text-xs mt-1" style={text(colors.textTertiary)}>
              ≈ {formData.weight.imperial} lbs
            </p>
          )}
        </div>

        {/* Dimensions */}
        <div className="mb-6">
          <label className="flex items-center text-sm font-medium mb-2" style={text(colors.textSecondary)}>
            Dimensions (W × H × D)
            <Tooltip fieldName="dimensions" />
            {(numericErrors.sizeWidth || numericErrors.sizeHeight || numericErrors.sizeDepth) && (
              <span className="ml-auto text-xs text-red-400">
                Only numerical values allowed
              </span>
            )}
          </label>
          <div className="flex gap-2 items-center mb-2">
            <input
              type="text"
              inputMode="decimal"
              value={sizeUnit === 'in' ? formData.sizeImperial.width : formData.sizeMetric.width}
              onChange={(e) => {
                handleNumericInput('sizeWidth', e.target.value);
                if (!numericErrors.sizeWidth) {
                  if (sizeUnit === 'in') {
                    handleNestedChange('sizeImperial', 'width', e.target.value);
                    handleNestedChange('sizeMetric', 'width', convertInchesToCm(e.target.value));
                  } else {
                    handleNestedChange('sizeMetric', 'width', e.target.value);
                    handleNestedChange('sizeImperial', 'width', convertCmToInches(e.target.value));
                  }
                }
              }}
              className="flex-1 px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="Width"
            />
            <span className="flex items-center" style={text(colors.textTertiary)}>×</span>
            <input
              type="text"
              inputMode="decimal"
              value={sizeUnit === 'in' ? formData.sizeImperial.height : formData.sizeMetric.height}
              onChange={(e) => {
                handleNumericInput('sizeHeight', e.target.value);
                if (!numericErrors.sizeHeight) {
                  if (sizeUnit === 'in') {
                    handleNestedChange('sizeImperial', 'height', e.target.value);
                    handleNestedChange('sizeMetric', 'height', convertInchesToCm(e.target.value));
                  } else {
                    handleNestedChange('sizeMetric', 'height', e.target.value);
                    handleNestedChange('sizeImperial', 'height', convertCmToInches(e.target.value));
                  }
                }
              }}
              className="flex-1 px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="Height"
            />
            <span className="flex items-center" style={text(colors.textTertiary)}>×</span>
            <input
              type="text"
              inputMode="decimal"
              value={sizeUnit === 'in' ? formData.sizeImperial.depth : formData.sizeMetric.depth}
              onChange={(e) => {
                  handleNumericInput('sizeDepth', e.target.value);
                  if (!numericErrors.sizeDepth) {
                    if (sizeUnit === 'in') {
                      handleNestedChange('sizeImperial', 'depth', e.target.value);
                      handleNestedChange('sizeMetric', 'depth', convertInchesToCm(e.target.value));
                    } else {
                      handleNestedChange('sizeMetric', 'depth', e.target.value);
                      handleNestedChange('sizeImperial', 'depth', convertCmToInches(e.target.value));
                    }
                  }
                }}
                className="flex-1 px-4 py-2 rounded border text-white"
                style={style(bg(colors.darkBg), border(colors.border))}
                placeholder="Depth"
              />
              <Toggle
                value={sizeUnit}
                onChange={(val) => setSizeUnit(val)}
                option1={{ label: 'in', value: 'in' }}
                option2={{ label: 'cm', value: 'cm' }}
              />
            </div>
            {sizeUnit === 'in' && formData.sizeMetric.width && (
              <p className="text-xs mt-1" style={text(colors.textTertiary)}>
                ≈ {formData.sizeMetric.width} × {formData.sizeMetric.height} × {formData.sizeMetric.depth} cm
              </p>
            )}
            {sizeUnit === 'cm' && formData.sizeImperial.width && (
              <p className="text-xs mt-1" style={text(colors.textTertiary)}>
                ≈ {formData.sizeImperial.width} × {formData.sizeImperial.height} × {formData.sizeImperial.depth} in
              </p>
            )}
          </div>

          {/* Launch MSRP */}
          <div>
            <label className="flex items-center text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Launch MSRP
              <Tooltip fieldName="launchMSRP" />
              {numericErrors.launchMSRP && (
                <span className="ml-auto text-xs text-red-400">
                  Only numerical values allowed
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <select
                value={formData.msrpCurrency}
                onChange={(e) => handleChange('msrpCurrency', e.target.value)}
                className="w-32 px-2 py-2 rounded border text-white"
                style={style(bg(colors.darkBg), border(colors.border))}
              >
                <option value="">Select</option>
                {currencyOptions.map(cur => (
                  <option key={cur.code} value={cur.code}>{cur.label}</option>
                ))}
              </select>
              <input
                type="text"
                inputMode="numeric"
                value={formData.launchMSRP}
                onChange={(e) => handleNumericInput('launchMSRP', e.target.value)}
                className="flex-1 px-4 py-2 rounded border text-white"
                style={style(bg(colors.darkBg), border(colors.border))}
                placeholder="e.g., 2500"
              />
            </div>
          </div>
        </div>

      {/* Additional Details */}
      <div className="rounded p-6 border" style={style(bg(colors.cardBg), border(colors.border))}>
        <h3 className="text-2xl font-bold text-white mb-6">Additional Details</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Extra Features
              <Tooltip fieldName="extraFeatures" />
            </label>
            <textarea
              value={formData.extraFeatures}
              onChange={(e) => handleChange('extraFeatures', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded border text-white"
              style={style(bg(colors.darkBg), border(colors.border))}
              placeholder="e.g., Multi-format support, blue-only mode, underscan..."
            />
          </div>

          {/* Similar Models */}
          <div>
            <label className="block text-sm font-medium mb-2" style={text(colors.textSecondary)}>
              Similar Models
              <Tooltip fieldName="similarModels" />
            </label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => {
                  addToArray('similarModels', newSimilarModel);
                  setNewSimilarModel('');
                }}
                className="px-4 py-2 rounded text-white flex-shrink-0"
                style={bg(colors.interactive)}
              >
                <Plus size={20} />
              </button>
              <input
                type="text"
                value={newSimilarModel}
                onChange={(e) => setNewSimilarModel(e.target.value)}
                className="flex-1 px-4 py-2 rounded border text-white"
                style={style(bg(colors.darkBg), border(colors.border))}
                placeholder="e.g., PVM-20M4U"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToArray('similarModels', newSimilarModel);
                    setNewSimilarModel('');
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.similarModels.map((model, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded flex items-center gap-2"
                  style={style(bg(colors.interactive), text(colors.textSecondary))}
                >
                  {model}
                  <button
                    type="button"
                    onClick={() => removeFromArray('similarModels', idx)}
                    className="hover:text-red-400"
                  >
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded font-semibold transition-colors"
            style={style(bg(colors.darkBg), text(colors.textSecondary), border(colors.border), { border: '1px solid' })}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-3 rounded font-semibold text-white transition-colors flex items-center gap-2"
          style={bg(colors.interactive)}
        >
          <Save size={20} />
          {existingCrt ? 'Update CRT' : 'Add CRT'}
        </button>
      </div>
    </form>
  );
}

export default CrtForm;