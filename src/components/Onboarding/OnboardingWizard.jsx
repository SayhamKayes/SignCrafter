import { useState, useEffect } from 'react';
import { useSignatureStore } from '../../store/useSignatureStore';

export default function OnboardingWizard() {
  const [step, setStep] = useState(0); 
  const [tempName, setTempName] = useState('');
  const [tempIndustry, setTempIndustry] = useState('');
  const [selectedSocials, setSelectedSocials] = useState([]);
  
  const store = useSignatureStore();

  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const toggleSocial = (id) => {
    if (selectedSocials.includes(id)) {
      setSelectedSocials(selectedSocials.filter(s => s !== id));
    } else {
      setSelectedSocials([...selectedSocials, id]);
    }
  };

  const handleFinish = () => {
    store.updatePersonalDetails('name', tempName || "Your Name");
    if (tempIndustry) store.setIndustryAndTitle(tempIndustry);
    if (selectedSocials.length > 0) store.setInitialSocials(selectedSocials);
    store.completeOnboarding();
  };

  if (step === 0) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <img src="./SignCrafter-logo.png" alt="Loading..." style={{ height: '120px', animation: 'pulse 1.5s infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box', overflow: 'hidden' }}>
      <div className="panel" style={{ maxWidth: '1080px', width: '100%', maxHeight: '100%', overflowY: 'auto', textAlign: 'center', boxSizing: 'border-box' }}>
        
        {/* STEP 1: Template Selection (Now with Previews!) */}
        {step === 1 && (
          <>
            <h2>Choose a Starting Template</h2>
            <div className="masonry-grid">
              {[1, 2, 3, 4, 5, 6, 7].map(id => (
                <div 
                  key={id} className="masonry-item"
                  onClick={() => store.setTemplate(id)} 
                  style={{ 
                    border: store.currentTemplate === id ? '2px solid var(--primary)' : '1px solid var(--border)', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    padding: '10px',
                    background: 'var(--surface)'
                  }}>
                  <img src={`./templates/preview-${id}.png`} alt={`Template ${id}`} style={{ width: '100%', display: 'block', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
            <button className="btn" style={{ marginTop: '20px', width: '100%' }} onClick={() => setStep(2)}>Next Step</button>
          </>
        )}

        {/* STEP 2: Name & Industry */}
        {step === 2 && (
          <>
            <h2>Tell us about yourself</h2>
            <div className="form-group" style={{ textAlign: 'left', marginTop: '20px' }}>
              <label>Your Name</label>
              <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder="e.g. John Doe" />
            </div>
            <div className="form-group" style={{ textAlign: 'left', marginTop: '15px' }}>
              <label>Identify your Industry</label>
              <select value={tempIndustry} onChange={(e) => setTempIndustry(e.target.value)}>
                <option value="" disabled>Select Industry...</option>
                <option value="Software / IT">Software / IT</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button className="btn" style={{ marginTop: '30px', width: '100%' }} onClick={() => setStep(3)}>Next Step</button>
          </>
        )}

        {/* STEP 3: Social Networks (Minimum 3 Logic) */}
        {step === 3 && (
          <>
            <h2>Select your top networks</h2>
            <p style={{ fontSize: '13px', color: selectedSocials.length < 3 ? '#F87171' : '#4ADE80' }}>
              {selectedSocials.length < 3 ? `Please select at least 3 (You have ${selectedSocials.length})` : `Great! You've selected ${selectedSocials.length}`}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              {['facebook', 'instagram', 'linkedin', 'twitter', 'youtube', 'github'].map(net => (
                <button 
                  key={net} 
                  onClick={() => toggleSocial(net)}
                  style={{ 
                    padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', textTransform: 'capitalize',
                    border: selectedSocials.includes(net) ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: selectedSocials.includes(net) ? 'var(--primary)' : 'transparent',
                    color: selectedSocials.includes(net) ? '#fff' : 'var(--text)'
                  }}>
                  {net}
                </button>
              ))}
            </div>
            {/* The button is disabled and greyed out until they pick 3 */}
            <button 
              className="btn" 
              style={{ marginTop: '30px', width: '100%', opacity: selectedSocials.length < 3 ? 0.5 : 1, cursor: selectedSocials.length < 3 ? 'not-allowed' : 'pointer' }} 
              onClick={() => setStep(4)}
              disabled={selectedSocials.length < 3}
            >
              Next Step
            </button>
          </>
        )}

        {/* STEP 4: Email Client Cards */}
        {step === 4 && (
          <>
            <h2>Where will you use this?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
              {[
                { id: 'gmail', name: 'Gmail', icon: 'M' },
                { id: 'outlook', name: 'Outlook', icon: 'O' },
                { id: 'apple', name: 'Apple Mail', icon: 'A' },
                { id: 'yahoo', name: 'Yahoo', icon: 'Y' },
                { id: 'other', name: 'Other / Web', icon: '🌐' }
              ].map(client => (
                <div 
                  key={client.id}
                  onClick={() => store.setEmailClient(client.id)}
                  style={{
                    padding: '15px', border: store.emailClient === client.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                    borderRadius: '8px', cursor: 'pointer', background: 'var(--surface)'
                  }}>
                  <span style={{ fontSize: '24px', display: 'block', marginBottom: '5px' }}>{client.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{client.name}</span>
                </div>
              ))}
            </div>
            <button className="btn" style={{ marginTop: '30px', width: '100%' }} onClick={handleFinish}>Generate Signature</button>
          </>
        )}

      </div>
    </div>
  );
}