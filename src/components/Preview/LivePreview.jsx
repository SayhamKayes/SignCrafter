import { useSignatureStore } from '../../store/useSignatureStore';
import { generateSignatureHTML } from '../../utils/templateGenerator';

export default function LivePreview() {
  const state = useSignatureStore();
  const htmlContent = generateSignatureHTML(state);

  // --- THE FIX: Universal Signature Wrapper ---
  // 1. overflowX: 'auto' allows horizontal scrolling on small screens
  // 2. minWidth: '450px' prevents the signature from squishing
  // 3. clear: 'both' stops the signature tables from floating over the Send button
  const renderSignatureWrapper = () => (
    <div style={{ overflowX: 'auto', width: '100%', paddingBottom: '10px' }}>
      <div 
        id="actual-signature-content" 
        style={{ minWidth: '450px', color: '#000' }} 
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
      <div style={{ clear: 'both' }}></div>
    </div>
  );

  const renderMockEmailUI = () => {
    switch(state.emailClient) {
      case 'gmail':
        return (
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ background: '#f2f6fc', padding: '10px 15px', fontSize: '13px', fontWeight: '500', color: '#1f1f1f', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between' }}>
              <span>New Message</span>
              <span>_ &nbsp; 🗖 &nbsp; ✕</span>
            </div>
            <div style={{ padding: '8px 15px', borderBottom: '1px solid #e0e0e0', color: '#5f6368', fontSize: '13px' }}>To</div>
            <div style={{ padding: '8px 15px', borderBottom: '1px solid #e0e0e0', color: '#5f6368', fontSize: '13px' }}>Subject</div>
            <div style={{ padding: '20px', minHeight: '150px' }}>
              <div style={{ marginBottom: '40px', color: '#000', fontSize: '14px' }}>Hi there,<br/><br/>I wanted to reach out regarding...</div>
              {/* Call the new wrapper here! */}
              {renderSignatureWrapper()}
            </div>
            <div style={{ padding: '15px', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '10px' }}>
              <button style={{ background: '#0b57d0', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '20px', fontWeight: '500' }}>Send</button>
            </div>
          </div>
        );

      case 'outlook':
        return (
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ background: '#f3f2f1', padding: '8px', borderBottom: '1px solid #e0e0e0', display: 'flex', gap: '15px', fontSize: '12px' }}>
              <span style={{ color: '#0078d4', fontWeight: 'bold' }}>Send</span>
              <span style={{ color: '#605e5c' }}>Attach ▾</span>
              <span style={{ color: '#605e5c' }}>Discard</span>
            </div>
            <div style={{ padding: '10px 20px', borderBottom: '1px solid #e0e0e0', color: '#605e5c', fontSize: '13px', display: 'flex' }}>
              <span style={{ width: '40px' }}>To</span>
            </div>
            <div style={{ padding: '10px 20px', borderBottom: '1px solid #e0e0e0', color: '#605e5c', fontSize: '13px', display: 'flex' }}>
              <span style={{ width: '40px' }}>Cc</span>
            </div>
            <div style={{ padding: '10px 20px', borderBottom: '1px solid #e0e0e0', color: '#605e5c', fontSize: '13px' }}>Add a subject</div>
            <div style={{ padding: '20px', minHeight: '150px' }}>
              {/* Call the new wrapper here! */}
              {renderSignatureWrapper()}
            </div>
          </div>
        );

      case 'apple':
        return (
          <div style={{ background: '#fff', border: '1px solid #d1d1d6', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ background: '#f6f6f6', padding: '10px', borderBottom: '1px solid #d1d1d6', textAlign: 'center', fontSize: '13px', fontWeight: 'bold', color: '#000' }}>
              New Message
            </div>
            <div style={{ padding: '8px 15px', borderBottom: '1px solid #e5e5ea', color: '#8e8e93', fontSize: '13px' }}>To:</div>
            <div style={{ padding: '8px 15px', borderBottom: '1px solid #e5e5ea', color: '#8e8e93', fontSize: '13px' }}>Subject:</div>
            <div style={{ padding: '20px', minHeight: '150px' }}>
              <div style={{ marginBottom: '20px' }}></div>
              {/* Call the new wrapper here! */}
              {renderSignatureWrapper()}
            </div>
          </div>
        );

      case 'yahoo':
        return (
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ padding: '15px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center' }}>
              <button style={{ background: '#6001d2', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '4px', fontWeight: 'bold', marginRight: '15px' }}>Send</button>
            </div>
            <div style={{ padding: '10px 15px', borderBottom: '1px solid #e0e0e0', color: '#6001d2', fontSize: '13px' }}>To</div>
            <div style={{ padding: '10px 15px', borderBottom: '1px solid #e0e0e0', color: '#6001d2', fontSize: '13px' }}>Subject</div>
            <div style={{ padding: '20px', minHeight: '150px' }}>
              {/* Call the new wrapper here! */}
              {renderSignatureWrapper()}
            </div>
          </div>
        );

      default:
        return (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px dashed var(--border)' }}>
             {renderSignatureWrapper()}
          </div>
        );
    }
  };

  return (
    <div id="previewArea" style={{ overflowX: 'hidden', paddingTop: '10px', width: '100%' }}>
      {renderMockEmailUI()}
    </div>
  );
}