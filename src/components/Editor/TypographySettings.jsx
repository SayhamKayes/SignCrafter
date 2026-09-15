import { useSignatureStore } from '../../store/useSignatureStore';
import { emailSafeFonts } from '../../utils/constants';

export default function TypographySettings() {
  const { fonts, updateFont } = useSignatureStore();

  const renderFontControls = (label, elementKey) => (
    <div className="form-group" style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
      
      {/* MAIN HEADING COLOR: 
        Change the 'color' value right here to adjust "Name Styling", "Job Title Styling", etc. 
        You can use a hex code like '#ffffff' or '#F87171' instead of 'var(--text)'
      */}
      <label style={{ color: 'var(--text)', fontSize: '15px', fontWeight: '600', marginBottom: '12px', display: 'block' }}>
        {label}
      </label>
      
      {/* 2x2 Grid for Mobile-Friendly Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px 8px' }}>
        
        {/* Font Family Control */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '500' }}>Font Family</label>
          <select 
            value={fonts[elementKey].family} 
            onChange={(e) => updateFont(elementKey, 'family', e.target.value)}
          >
            {emailSafeFonts.map(font => (
              <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>
                {font.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Font Weight Control */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '500' }}>Weight</label>
          <select 
            value={fonts[elementKey].weight} 
            onChange={(e) => updateFont(elementKey, 'weight', e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="500">Medium</option>
            <option value="bold">Bold</option>
          </select>
        </div>

        {/* Font Style Control */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '500' }}>Style</label>
          <select 
            value={fonts[elementKey].style} 
            onChange={(e) => updateFont(elementKey, 'style', e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="italic">Italic</option>
          </select>
        </div>

        {/* Text Transform Control */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '500' }}>Transform</label>
          <select 
            value={fonts[elementKey].transform} 
            onChange={(e) => updateFont(elementKey, 'transform', e.target.value)}
          >
            <option value="none">Normal Case</option>
            <option value="uppercase">UPPERCASE</option>
            <option value="lowercase">lowercase</option>
            <option value="capitalize">Capitalize</option>
          </select>
        </div>

      </div>
    </div>
  );

  return (
    <>
      <h3 style={{ marginTop: '24px' }}>Typography & Styling</h3>
      <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
        {renderFontControls('Name Styling', 'name')}
        {renderFontControls('Job Title Styling', 'title')}
        {renderFontControls('Company Styling', 'company')}
        {renderFontControls('Contact Info Styling', 'contact')}
      </div>
    </>
  );
}