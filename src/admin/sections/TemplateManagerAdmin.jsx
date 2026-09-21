import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { uploadAdminAsset } from '../services/adminUploadService';
import { saveCustomTemplate, deleteCustomTemplate } from '../services/adminDataService';
import { useSignatureStore } from '../../store/useSignatureStore';

const BUILT_IN_TEMPLATES = [
  { id: 1, name: 'Executive Minimal', isBuiltIn: true, preview: './templates/preview-1.png' },
  { id: 2, name: 'Professional Split', isBuiltIn: true, preview: './templates/preview-2.png' },
  { id: 3, name: 'Vibrant Modern', isBuiltIn: true, preview: './templates/preview-3.png' },
  { id: 4, name: 'Header Banner', isBuiltIn: true, preview: './templates/preview-4.png' },
  { id: 5, name: 'Corporate Formal', isBuiltIn: true, preview: './templates/preview-5.png' },
  { id: 6, name: 'Business Promotional', isBuiltIn: true, preview: './templates/preview-6.png' },
  { id: 7, name: 'Personal Portfolio', isBuiltIn: true, preview: './templates/preview-7.png' },
];

const DEFAULT_SAMPLE_HTML = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: {{fontFamily}}, Arial, sans-serif; max-width: 500px; color: #1e293b;">
  <tr>
    <td valign="top" style="padding-right: 18px;">
      <img src="{{profileImg}}" width="90" height="90" style="border-radius: 50%; display: block; border: 2px solid {{primaryColor}};" alt="{{name}}" />
    </td>
    <td valign="middle" style="border-left: 2px solid {{primaryColor}}; padding-left: 18px;">
      <div style="font-size: 18px; font-weight: bold; color: {{primaryColor}}; margin-bottom: 3px;">{{name}}</div>
      <div style="font-size: 13px; color: #64748b; font-weight: 500; margin-bottom: 2px;">{{title}} • {{company}}</div>
      <div style="margin-top: 10px; font-size: 12px; line-height: 1.6; color: #475569;">
        {{contacts}}
      </div>
      <div style="margin-top: 10px;">
        {{socials}}
      </div>
    </td>
  </tr>
</table>`;

export default function TemplateManagerAdmin() {
  const { customTemplates, loadAdminData } = useSignatureStore();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Form State
  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('Modern');
  const [previewUrl, setPreviewUrl] = useState('');
  const [templateHtml, setTemplateHtml] = useState(DEFAULT_SAMPLE_HTML);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  const resetForm = () => {
    setEditingTemplate(null);
    setTemplateName('');
    setTemplateCategory('Modern');
    setPreviewUrl('');
    setTemplateHtml(DEFAULT_SAMPLE_HTML);
    setStatusMsg({ text: '', type: '' });
  };

  const openNewTemplateModal = () => {
    resetForm();
    setIsEditorOpen(true);
  };

  const openEditModal = (tpl) => {
    setEditingTemplate(tpl);
    setTemplateName(tpl.name || '');
    setTemplateCategory(tpl.category || 'Modern');
    setPreviewUrl(tpl.preview || '');
    setTemplateHtml(tpl.html || DEFAULT_SAMPLE_HTML);
    setStatusMsg({ text: '', type: '' });
    setIsEditorOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setStatusMsg({ text: 'Uploading preview image to Cloudinary...', type: 'info' });
      const res = await uploadAdminAsset(file, 'signcrafter_system/templates');
      setPreviewUrl(res.url);
      setStatusMsg({ text: 'Preview image uploaded to Cloudinary successfully!', type: 'success' });
    } catch (err) {
      setStatusMsg({ text: `Upload failed: ${err.message}`, type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const insertToken = (token) => {
    setTemplateHtml(prev => prev + `\n${token}`);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!templateName.trim()) {
      alert('Please enter a template name.');
      return;
    }

    try {
      setIsSaving(true);
      const tplId = editingTemplate ? editingTemplate.id : `tpl_custom_${Date.now()}`;
      await saveCustomTemplate({
        id: tplId,
        name: templateName.trim(),
        category: templateCategory,
        preview: previewUrl || 'https://ui-avatars.com/api/?name=Custom+Template&background=3B82F6&color=fff&size=200',
        html: templateHtml,
        isBuiltIn: false
      });

      await loadAdminData();
      setStatusMsg({ text: 'Template saved to Cloud Firestore & Local Cache successfully!', type: 'success' });
      setTimeout(() => {
        setIsEditorOpen(false);
        resetForm();
      }, 700);
    } catch (err) {
      setStatusMsg({ text: `Save error: ${err.message}`, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (tplId) => {
    if (!window.confirm('Are you sure you want to delete this custom template?')) return;
    try {
      await deleteCustomTemplate(tplId);
      await loadAdminData();
    } catch (err) {
      alert(`Could not delete template: ${err.message}`);
    }
  };

  // Compile sample preview for admin
  const renderSamplePreview = () => {
    let rendered = templateHtml
      .replace(/{{name}}/g, 'Alex Rivera')
      .replace(/{{title}}/g, 'Lead Product Designer')
      .replace(/{{company}}/g, 'Nexus Innovations')
      .replace(/{{primaryColor}}/g, '#3B82F6')
      .replace(/{{fontFamily}}/g, 'Arial, sans-serif')
      .replace(/{{profileImg}}/g, 'https://ui-avatars.com/api/?name=Alex+Rivera&background=0F172A&color=fff&size=100')
      .replace(/{{logoImg}}/g, 'https://ui-avatars.com/api/?name=Nexus&background=3B82F6&color=fff&size=100')
      .replace(/{{bannerImg}}/g, 'https://ui-avatars.com/api/?name=Banner&background=E2E8F0&color=333&size=400')
      .replace(/{{contacts}}/g, '📞 +1 (555) 019-2834<br/>✉️ alex@nexusinno.com<br/>🌐 www.nexusinno.com')
      .replace(/{{socials}}/g, '💼 LinkedIn • 🐦 Twitter • 🌐 GitHub');

    return { __html: rendered };
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: 'var(--text)' }}>
            Signature Templates Repository
          </h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Manage built-in templates and create high-conversion custom HTML layouts.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewTemplateModal}
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
          <span>➕ Add New Template</span>
        </button>
      </div>

      {/* Grid of Templates */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {/* Built-in templates */}
        {BUILT_IN_TEMPLATES.map(tpl => (
          <div
            key={tpl.id}
            className="panel"
            style={{
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '16 / 10', background: '#0f172a', marginBottom: '12px', border: '1px solid var(--glass-border)' }}>
                <img
                  src={tpl.preview}
                  alt={tpl.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(tpl.name) + "&background=1E293B&color=94A3B8&size=300";
                  }}
                />
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: 'rgba(0, 0, 0, 0.65)',
                  backdropFilter: 'blur(6px)',
                  color: '#94a3b8',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  Core #{tpl.id}
                </span>
              </div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: 'var(--text)', fontWeight: '700' }}>
                {tpl.name}
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                Built-in native layout
              </p>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '600' }}>
                ✓ Active System
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Locked
              </span>
            </div>
          </div>
        ))}

        {/* Custom Templates from Firestore */}
        {customTemplates.map(tpl => (
          <div
            key={tpl.id}
            className="panel"
            style={{
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              boxShadow: '0 8px 24px -8px rgba(59, 130, 246, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '16 / 10', background: '#0f172a', marginBottom: '12px', border: '1px solid var(--glass-border)' }}>
                <img
                  src={tpl.preview}
                  alt={tpl.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(tpl.name) + "&background=3B82F6&color=fff&size=300";
                  }}
                />
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: 'rgba(59, 130, 246, 0.85)',
                  backdropFilter: 'blur(6px)',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  Custom Admin
                </span>
              </div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: 'var(--text)', fontWeight: '700' }}>
                {tpl.name}
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                Category: {tpl.category || 'Modern'}
              </p>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => openEditModal(tpl)}
                style={{
                  background: 'rgba(59, 130, 246, 0.12)',
                  color: 'var(--primary)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✏️ Edit Code
              </button>

              <button
                type="button"
                onClick={() => handleDelete(tpl.id)}
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
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
              maxWidth: '900px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '20px',
              border: '1px solid var(--glass-border)',
              padding: '30px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'var(--text)' }}>
                {editingTemplate ? `Edit Template: ${editingTemplate.name}` : 'Create New Signature Template'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-muted)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ✕
              </button>
            </div>

            {statusMsg.text && (
              <div style={{
                padding: '12px',
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

            <form onSubmit={handleSave}>
              {/* Form Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>
                    Template Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Executive Dark"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', color: 'var(--text)', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={templateCategory}
                    onChange={(e) => setTemplateCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', color: 'var(--text)', boxSizing: 'border-box' }}
                  >
                    <option value="Modern">Modern</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Creative">Creative</option>
                    <option value="Banner">Banner / Header</option>
                  </select>
                </div>
              </div>

              {/* Preview Image Upload to Cloudinary */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>
                  Template Thumbnail / Preview Image (Direct Cloudinary Upload)
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', color: 'var(--text)' }}
                  />
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Thumbnail Preview"
                      style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--glass-border)' }}
                    />
                  )}
                </div>
                {previewUrl && (
                  <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px', fontFamily: 'monospace' }}>
                    Cloudinary URL: {previewUrl}
                  </div>
                )}
              </div>

              {/* Dynamic Tokens Helper */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>
                  Insert Dynamic Template Tokens (Click to append into code):
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['{{name}}', '{{title}}', '{{company}}', '{{profileImg}}', '{{logoImg}}', '{{bannerImg}}', '{{contacts}}', '{{socials}}', '{{primaryColor}}', '{{fontFamily}}'].map(token => (
                    <button
                      key={token}
                      type="button"
                      onClick={() => insertToken(token)}
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(59, 130, 246, 0.12)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: 'var(--primary)',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      + {token}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Editor */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>
                  Email-Safe HTML Layout Code *
                </label>
                <textarea
                  rows={10}
                  required
                  value={templateHtml}
                  onChange={(e) => setTemplateHtml(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    borderRadius: '8px',
                    background: '#0a0f1d',
                    color: '#38bdf8',
                    border: '1px solid var(--glass-border)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Live Admin Preview */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>
                  Live Test Render (Simulated with dummy values):
                </label>
                <div
                  style={{
                    padding: '16px',
                    background: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    overflowX: 'auto'
                  }}
                  dangerouslySetInnerHTML={renderSamplePreview()}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  style={{
                    padding: '10px 20px',
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
                    padding: '10px 24px',
                    fontSize: '14px',
                    fontWeight: '700'
                  }}
                >
                  {isSaving ? 'Saving to Firestore...' : '💾 Save Template'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
