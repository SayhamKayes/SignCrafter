import { useSignatureStore } from '../../store/useSignatureStore';

// --- 1. SLIDER COMPONENT ---
const SizeSlider = ({ label, value, min, max, onChange }) => (
  <div style={{ padding: '15px', background: 'var(--input-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <label style={{ fontSize: '11px', color: 'var(--text)', margin: 0 }}>{label}</label>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input 
          type="number" 
          min={min} 
          max={max} 
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: '40px',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--glass-border)',
            color: 'var(--primary)',
            fontWeight: 'bold',
            fontSize: '11px',
            textAlign: 'right',
            outline: 'none',
            padding: '0 2px'
          }}
        />
        <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'bold', marginLeft: '2px' }}>px</span>
      </div>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))} 
      style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary)' }} 
    />
  </div>
);

// --- 2. UPLOAD BOX COMPONENT ---
const UploadBox = ({ title, type, uploadingField, onFileChange, hint, fileName }) => (
  <div style={{ 
    background: 'var(--input-bg)', 
    padding: '15px', 
    borderRadius: '12px', 
    border: '1px solid var(--glass-border)',
    textAlign: 'center'
  }}>
    <label style={{ fontSize: '13px', marginBottom: '10px', color: 'var(--text)' }}>{title}</label>
    
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => {
          onFileChange(e, type);
          e.target.value = null; 
        }} 
        disabled={uploadingField === type}
        style={{ width: '100%', fontSize: '11px', padding: '8px 0', cursor: 'pointer' }}
      />
    </div>

    {/* --- File Name if it exists --- */}
    {fileName && (
        <p style={{ fontSize: '11px', color: 'var(--primary)', margin: '8px 0 0 0', fontWeight: 'bold', wordBreak: 'break-all' }}>
          📄 {fileName}
        </p>
    )}

    {/* --- Hint text here --- */}
    {hint && (
      <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '5px 0 0 0', lineHeight: '1.2' }}>
        {hint}
      </p>
    )}
    
    {uploadingField === type && (
      <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'bold', display: 'block', marginTop: '5px' }}>
        Uploading...
      </span>
    )}
  </div>
);

// --- 3. MAIN COMPONENT ---
export default function ImageSettings() {
  const { 
    uploadImage, 
    uploadingField, 
    images, 
    imageNames,
    setCompanyWidth, 
    setProfileWidth, 
    setBannerWidth,
    // customImages,
    uploadCustomImages,
    // removeCustomImage
  } = useSignatureStore();

  const handleFileChange = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) return alert("File is too large! Please choose an image under 2MB.");
      uploadImage(file, imageType);
    }
  };

  const handleMultiFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const validFiles = Array.from(files).filter(file => file.size <= 2000000);
      if (validFiles.length < files.length) {
        alert("Some files were skipped because they are over the 2MB limit.");
      }
      if (validFiles.length > 0) {
        uploadCustomImages(validFiles);
      }
    }
  };

  return (
    <div className="panel" style={{ marginTop: '20px' }}>
      <h3 style={{ marginTop: 0 }}>Images & Branding</h3>
      
      <div>
        {/* TOP GRID: UPLOAD BOXES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', alignItems: 'start' }}>
  
          <UploadBox 
            title="Profile Picture" 
            type="profile" 
            uploadingField={uploadingField} 
            onFileChange={handleFileChange} 
            hint="Ratio must be 1:1 (Square) | 2MB max" 
            fileName={imageNames.profile}
          />
          
          <UploadBox 
            title="Company Logo" 
            type="company" 
            uploadingField={uploadingField} 
            onFileChange={handleFileChange} 
            hint="Transparent PNG recommended | 2MB max" 
            fileName={imageNames.company}
          />
          
          <UploadBox 
            title="Banner Image" 
            type="banner" 
            uploadingField={uploadingField} 
            onFileChange={handleFileChange} 
            hint="Image ratio 67:20(268x80px) | 2MB max" 
            fileName={imageNames.banner}
          />

        </div>

        {/* BOTTOM GRID: DYNAMIC SLIDERS (Restored!) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '15px', alignItems: 'start' }}>
          
          {/* Profile Slider */}
          <div>
            {images.profile && (
              <SizeSlider label="Profile Size" value={images.profileWidth} min={50} max={250} onChange={setProfileWidth} />
            )}
          </div>

          {/* Logo Slider */}
          <div>
            {images.company && (
              <SizeSlider label="Logo Size" value={images.companyWidth} min={50} max={250} onChange={setCompanyWidth} />
            )}
          </div>

          {/* Banner Slider */}
          <div>
            {images.banner && (
              <SizeSlider label="Banner Size" value={images.bannerWidth} min={100} max={600} onChange={setBannerWidth} />
            )}
          </div>

        </div>

        {/* UNLIMITED CUSTOM IMAGES GALLERY */}
        {/* <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text)' }}>Additional Images / Badges</label>
            {uploadingField === 'custom' && <span style={{ fontSize: '11px', color: 'var(--primary)' }}>Uploading...</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
            
            <div style={{ 
              background: 'var(--input-bg)', borderRadius: '12px', border: '1px dashed var(--primary)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px', position: 'relative', cursor: 'pointer', transition: '0.2s'
            }}>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={(e) => {
                  handleMultiFileChange(e);
                  e.target.value = null; // Fix applied here too!
                }}
                disabled={uploadingField === 'custom'}
                style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 2 }}
              />
              <span style={{ fontSize: '24px', color: 'var(--primary)', fontWeight: 'bold' }}>+</span>
            </div>

            {customImages?.map((url, idx) => (
              <div key={idx} style={{ position: 'relative', height: '60px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                <img src={url} alt={`Custom ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  onClick={() => removeCustomImage(idx)}
                  style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ✕
                </button>
              </div>
            ))}

          </div>
        </div> */}

      </div>
    </div>
  );
}