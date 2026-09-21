import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { uploadAdminAsset } from '../services/adminUploadService';
import { saveCustomSocial, deleteCustomSocial } from '../services/adminDataService';
import { useSignatureStore } from '../../store/useSignatureStore';
import { socialsDB as DEFAULT_SOCIALS } from '../../utils/constants';

const COLOR_CATEGORIES = [
  { id: 'all', label: 'All Platforms', color: 'var(--primary)' },
  { id: 'official', label: 'Official Brand Colors', color: '#10B981' },
  { id: 'blue', label: 'Blue Icons Set', color: '#1D4ED8' },
  { id: 'red', label: 'Red Icons Set', color: '#DC2626' },
  { id: 'dark', label: 'Dark / Monochrome Set', color: '#1E293B' },
  { id: 'custom', label: 'Custom Cloudinary Icons', color: '#8B5CF6' }
];

export default function SocialManagerAdmin() {
  const { customSocials, loadAdminData } = useSignatureStore();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [platformId, setPlatformId] = useState('');
  const [brandColor, setBrandColor] = useState('#3B82F6');
  const [colorCategory, setColorCategory] = useState('official');
  const [cloudinaryIconUrl, setCloudinaryIconUrl] = useState('');
  const [icon8Name, setIcon8Name] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  // Merge default socials with custom overrides
  const combinedSocials = [...DEFAULT_SOCIALS];
  customSocials.forEach(c => {
    const idx = combinedSocials.findIndex(s => s.id === c.id);
    if (idx >= 0) {
      combinedSocials[idx] = { ...combinedSocials[idx], ...c, isCustom: true };
    } else {
      combinedSocials.push({ ...c, isCustom: true });
    }
  });

  // Filter based on category and search
  const filteredSocials = combinedSocials.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    if (activeCategory === 'custom') return !!s.cloudinaryIconUrl || s.isCustom;
    if (activeCategory === 'official') return !s.colorCategory || s.colorCategory === 'official';
    return s.colorCategory === activeCategory;
  });

  const openAddModal = () => {
    setEditingSocial(null);
    setName('');
    setPlatformId('');
    setBrandColor('#3B82F6');
    setColorCategory('official');
    setCloudinaryIconUrl('');
    setIcon8Name('');
    setStatusMsg({ text: '', type: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (s) => {
    setEditingSocial(s);
    setName(s.name);
    setPlatformId(s.id);
    setBrandColor(s.color || '#3B82F6');
    setColorCategory(s.colorCategory || 'official');
    setCloudinaryIconUrl(s.cloudinaryIconUrl || '');
    setIcon8Name(s.icon || '');
    setStatusMsg({ text: '', type: '' });
    setIsModalOpen(true);
  };

  const handleIconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('png') && !file.type.includes('webp') && !file.type.includes('jpeg')) {
      alert('Email clients require bitmap PNG images (SVG is stripped by Gmail and Outlook). Please upload a PNG file.');
      return;
    }

    try {
      setIsUploading(true);
      setStatusMsg({ text: 'Uploading high-res PNG icon to Cloudinary...', type: 'info' });
      const res = await uploadAdminAsset(file, 'signcrafter_system/social_icons');
      setCloudinaryIconUrl(res.url);
      setStatusMsg({ text: 'Icon successfully stored on Cloudinary CDN!', type: 'success' });
    } catch (err) {
      setStatusMsg({ text: `Icon upload failed: ${err.message}`, type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Platform name is required.');
      return;
    }

    const sId = (platformId.trim() || name.toLowerCase().replace(/[^a-z0-9]/g, '-')).toLowerCase();

    try {
      setIsSaving(true);
      await saveCustomSocial({
        id: sId,
        name: name.trim(),
        color: brandColor,
        colorCategory,
        icon: icon8Name.trim() || sId,
        cloudinaryIconUrl: cloudinaryIconUrl.trim()
      });

      await loadAdminData();
      setStatusMsg({ text: 'Social Platform & Icon saved successfully!', type: 'success' });
      setTimeout(() => {
        setIsModalOpen(false);
      }, 700);
    } catch (err) {
      setStatusMsg({ text: `Save error: ${err.message}`, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to reset/delete custom settings for ${id}?`)) return;
    try {
      await deleteCustomSocial(id);
      await loadAdminData();
    } catch (err) {
      alert(`Could not delete: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: 'var(--text)' }}>
            Social Media Platforms & Email-Safe PNG Icons
          </h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Upload direct Cloudinary PNG icons & organize platforms into color palettes for email client compatibility.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="btn"
          style={{
            padding: '12px 22px',
            fontSize: '14px',
            fontWeight: '700',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>➕ Add / Upload Platform Icon</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {COLOR_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                border: activeCategory === cat.id ? `1px solid ${cat.color}` : '1px solid var(--glass-border)',
                background: activeCategory === cat.id ? 'rgba(59, 130, 246, 0.15)' : 'var(--input-bg)',
                color: activeCategory === cat.id ? 'var(--text)' : 'var(--text-muted)',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search platforms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            background: 'var(--input-bg)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text)',
            fontSize: '13px',
            width: '220px'
          }}
        />
      </div>

      {/* Social Platforms Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {filteredSocials.map(s => {
          const displayIconUrl = s.cloudinaryIconUrl || `https://img.icons8.com/ios-filled/50/ffffff/${s.icon || s.id}.png`;

          return (
            <div
              key={s.id}
              className="panel"
              style={{
                padding: '14px',
                borderRadius: '14px',
                border: s.cloudinaryIconUrl ? '1px solid #10B981' : '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                transition: 'transform 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: s.color || '#3B82F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                  flexShrink: 0
                }}>
                  <img
                    src={displayIconUrl}
                    alt={s.name}
                    style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://img.icons8.com/ios-filled/50/ffffff/link.png";
                    }}
                  />
                </div>

                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {s.cloudinaryIconUrl ? '☁️ Cloudinary CDN' : 'Default Icon'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => openEditModal(s)}
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--primary)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                  title="Edit or upload PNG"
                >
                  ✏️
                </button>

                {s.isCustom && (
                  <button
                    type="button"
                    onClick={() => handleDelete(s.id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                    title="Delete custom platform"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Adding / Editing Social Icon */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="panel"
            style={{
              width: '100%',
              maxWidth: '560px',
              borderRadius: '20px',
              border: '1px solid var(--glass-border)',
              padding: '28px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text)' }}>
                {editingSocial ? `Configure Platform: ${editingSocial.name}` : 'Add Social Platform & Icon'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-muted)',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ✕
              </button>
            </div>

            {statusMsg.text && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '12px',
                background: statusMsg.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: statusMsg.type === 'error' ? '#ef4444' : '#10b981',
                border: `1px solid ${statusMsg.type === 'error' ? '#ef4444' : '#10b981'}`
              }}>
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
                    Platform Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Threads, Mastodon"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingSocial) {
                        setPlatformId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                      }
                    }}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', color: 'var(--text)', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
                    Platform ID
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingSocial}
                    placeholder="e.g. threads"
                    value={platformId}
                    onChange={(e) => setPlatformId(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', color: 'var(--text)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
                    Brand / Background Color
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      style={{ width: '38px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
                    />
                    <input
                      type="text"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', color: 'var(--text)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
                    Color Category
                  </label>
                  <select
                    value={colorCategory}
                    onChange={(e) => setColorCategory(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', color: 'var(--text)', boxSizing: 'border-box' }}
                  >
                    <option value="official">Official Brand Colors</option>
                    <option value="blue">Blue Set</option>
                    <option value="red">Red Set</option>
                    <option value="dark">Dark / Monochrome</option>
                    <option value="custom">Custom Color Set</option>
                  </select>
                </div>
              </div>

              {/* Upload PNG to Cloudinary */}
              <div style={{ marginBottom: '18px', padding: '14px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
                  Upload Email-Safe PNG Icon (Direct to Cloudinary CDN)
                </label>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 10px 0' }}>
                  Upload a transparent PNG icon (e.g. 64x64 or 128x128). Gmail and Outlook will reliably render it in signatures!
                </p>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/png, image/webp"
                    onChange={handleIconUpload}
                    disabled={isUploading}
                    style={{ flex: 1, padding: '6px', borderRadius: '8px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', color: 'var(--text)', fontSize: '12px' }}
                  />
                  {cloudinaryIconUrl && (
                    <div style={{ width: '38px', height: '38px', background: brandColor, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={cloudinaryIconUrl} alt="Icon Preview" style={{ width: '22px', height: '22px' }} />
                    </div>
                  )}
                </div>

                {cloudinaryIconUrl && (
                  <div style={{ fontSize: '11px', color: '#10B981', marginTop: '6px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    CDN URL: {cloudinaryIconUrl}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'var(--surface)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text)',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="btn"
                  style={{
                    padding: '8px 20px',
                    fontSize: '13px',
                    fontWeight: '700'
                  }}
                >
                  {isSaving ? 'Saving...' : '💾 Save Platform Icon'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
