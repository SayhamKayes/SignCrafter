import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
// 1. WE NEED TO IMPORT THESE TO GET THE PURE HTML!
import { useSignatureStore } from '../../store/useSignatureStore';
import { generateSignatureHTML } from '../../utils/templateGenerator';

export default function ActionButtons() {
  // 2. GET THE CURRENT STATE
  const state = useSignatureStore();
  
  const copySignature = () => {
    // 3. TARGET ONLY THE ISOLATED SIGNATURE, NOT THE WHOLE PREVIEW AREA
    const preview = document.getElementById('actual-signature-content');
    
    if (!preview) {
      alert("Could not find signature to copy!");
      return;
    }

    // We use the traditional DOM selection here because it's the only reliable way 
    // to copy *Rich Text* (colors, images) into the Android clipboard for email apps.
    const range = document.createRange();
    range.selectNode(preview); // Changed to selectNode to cleanly grab the container
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    
    try {
      document.execCommand('copy');
      alert('Signature copied! Open your email app (Gmail/Outlook) and paste it.');
    } catch (err) { 
      alert('Failed to copy. Your device may block rich-text clipboard access.'); 
    }
    
    selection.removeAllRanges();
  };

  const downloadHTML = async () => {
    // 4. INSTEAD OF SCRAPING THE SCREEN, WE GENERATE THE PURE HTML
    const htmlContent = generateSignatureHTML(state);

    // Check if we are running natively on an Android device
    if (Capacitor.isNativePlatform()) {
      try {
        // 1. Write the file to the Android cache directory
        const result = await Filesystem.writeFile({
          path: 'email_signature.html',
          data: htmlContent,
          directory: Directory.Cache,
          encoding: Encoding.UTF8,
        });

        // 2. Open the native Android "Share" menu so they can save it or email it to themselves
        await Share.share({
          title: 'My Email Signature',
          text: 'Here is my generated HTML email signature from SignCrafter!',
          url: result.uri,
          dialogTitle: 'Save or Share Signature',
        });
      } catch (error) {
        console.error('Error saving file natively:', error);
        alert('Could not save the file to your device.');
      }
    } else {
      // Standard Web Fallback
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; 
      a.download = 'email_signature.html';
      document.body.appendChild(a); 
      a.click();
      document.body.removeChild(a); 
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
      <button className="btn" onClick={copySignature}>
        Copy signature
      </button>
      <button 
        className="btn" 
        style={{ background: 'transparent', color: 'var(--primary)', border: '2px solid var(--primary)' }}
        onClick={downloadHTML}
      >
        Save / Share Source File
      </button>
    </div>
  );
}