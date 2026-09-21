import React, { useState } from 'react';
import { uploadAdminAsset } from '../services/adminUploadService';
import { saveCustomContact, deleteCustomContact } from '../services/adminDataService';
import { useSignatureStore } from '../../store/useSignatureStore';
import { contactIconsDB as DEFAULT_CONTACTS } from '../../utils/constants';

export default function ContactIconsAdmin() {
  const { customContacts, loadAdminData } = useSignatureStore();
  const [isUploading, setIsUploading] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  // Merge default contacts with custom contacts
  const mergedContacts = { ...DEFAULT_CONTACTS };
  customContacts.forEach(c => {
    mergedContacts[c.key] = { ...mergedContacts[c.key], ...c, isCustom: true };
  });

  const handleUploadIcon = async (contactKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('png') && !file.type.includes('webp') && !file.type.includes('jpeg')) {
      alert('Please upload a PNG file for email signature compatibility.');
      return;
    }

    try {
      setIsUploading(contactKey);
      setStatusMsg({ text: `Uploading PNG icon for ${contactKey} to Cloudinary...`, type: 'info' });
      const res = await uploadAdminAsset(file, 'signcrafter_system/contact_icons');

      const existing = mergedContacts[contactKey] || { name: contactKey, isLink: true, prefix: '' };
      await saveCustomContact({
        key: contactKey,
        name: existing.name,
        icon: existing.icon || contactKey,
        prefix: existing.prefix || '',
        isLink: existing.isLink ?? true,
        cloudinaryIconUrl: res.url
      });

      await loadAdminData();
      setStatusMsg({ text: `Custom icon for ${existing.name} uploaded and saved!`, type: 'success' });
    } catch (err) {
      setStatusMsg({ text: `Upload failed: ${err.message}`, type: 'error' });
    } finally {
      setIsUploading(null);
    }
  };

  const handleResetIcon = async (contactKey) => {
    if (!window.confirm(`Reset ${contactKey} to its default icon?`)) return;
    try {
      await deleteCustomContact(contactKey);
      await loadAdminData();
      setStatusMsg({ text: `Reset ${contactKey} to default system icon.`, type: 'info' });
    } catch (err) {
      alert(`Could not reset: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: 'var(--text)' }}>
          Contact Info Field Icons
        </h2>
        <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
          Assign email-safe PNG icons to standard contact fields. Uploading an icon here automatically hosts it on Cloudinary.
        </p>
      </div>

      {statusMsg.text && (
        <div style={{
          padding: '10px 14px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '13px',
          background: statusMsg.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          color: statusMsg.type === 'error' ? '#ef4444' : '#10b981',
          border: `1px solid ${statusMsg.type === 'error' ? '#ef4444' : '#10b981'}`
        }}>
          {statusMsg.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {Object.entries(mergedContacts).map(([key, data]) => {
          const displayIcon = data.cloudinaryIconUrl || `https://img.icons8.com/ios-filled/50/3b82f6/${data.icon}.png`;

          return (
            <div
              key={key}
              className="panel"
              style={{
                padding: '16px',
                borderRadius: '14px',
                border: data.cloudinaryIconUrl ? '1px solid #10B981' : '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={displayIcon}
                    alt={data.name}
                    style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://img.icons8.com/ios-filled/50/3b82f6/link.png";
                    }}
                  />
                </div>

                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>
                    {data.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {data.cloudinaryIconUrl ? '☁️ Cloudinary PNG' : 'Default System Icon'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                <label style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: isUploading === key ? 'wait' : 'pointer',
                  display: 'inline-block'
                }}>
                  {isUploading === key ? 'Uploading...' : 'Upload PNG'}
                  <input
                    type="file"
                    accept="image/png, image/webp"
                    disabled={isUploading === key}
                    onChange={(e) => handleUploadIcon(key, e)}
                    style={{ display: 'none' }}
                  />
                </label>

                {data.cloudinaryIconUrl && (
                  <button
                    type="button"
                    onClick={() => handleResetIcon(key)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: '10px',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
