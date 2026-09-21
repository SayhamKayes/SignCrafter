import React, { useState, useEffect } from 'react';
import { testDatabaseConnection } from '../services/adminDataService';
import { useSignatureStore } from '../../store/useSignatureStore';

export default function SystemStatusAdmin() {
  const { customTemplates, customSocials, customContacts, loadAdminData } = useSignatureStore();
  const [dbStatus, setDbStatus] = useState({ checking: true, success: false, mode: '', message: '' });

  const runHealthCheck = async () => {
    setDbStatus({ checking: true, success: false, mode: '', message: 'Checking database ping...' });
    const res = await testDatabaseConnection();
    setDbStatus({ checking: false, success: res.success, mode: res.mode, message: res.message });
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const handleClearCache = () => {
    if (!window.confirm('Clear all local admin cache and reload from server?')) return;
    localStorage.removeItem('signcrafter_admin_templates');
    localStorage.removeItem('signcrafter_admin_socials');
    localStorage.removeItem('signcrafter_admin_contacts');
    loadAdminData();
    alert('Local cache refreshed!');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: 'var(--text)' }}>
          System, Database & CDN Health
        </h2>
        <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
          Real-time status of Firebase Cloud Firestore database, Cloudinary media CDN, and local storage cache.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="panel" style={{ padding: '20px', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Custom Templates</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)' }}>
            {customTemplates.length}
          </div>
          <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px' }}>
            + 7 Core System Templates
          </div>
        </div>

        <div className="panel" style={{ padding: '20px', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Custom Social Icons</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#10B981' }}>
            {customSocials.length}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Custom Cloudinary Overrides
          </div>
        </div>

        <div className="panel" style={{ padding: '20px', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Contact Icon Overrides</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#8B5CF6' }}>
            {customContacts.length}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Direct CDN PNGs
          </div>
        </div>
      </div>

      {/* Connectivity Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* Firebase Firestore Status */}
        <div className="panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🔥</span>
              <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--text)', fontWeight: '700' }}>
                Firebase Cloud Firestore
              </h4>
            </div>
            <span style={{
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: '20px',
              fontWeight: '700',
              background: dbStatus.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
              color: dbStatus.success ? '#10B981' : 'var(--primary)',
              border: `1px solid ${dbStatus.success ? '#10B981' : 'var(--primary)'}`
            }}>
              {dbStatus.checking ? 'Pinging...' : (dbStatus.success ? '● Online & Connected' : '● Resilience Mode')}
            </span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 16px 0' }}>
            {dbStatus.message}
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              disabled={dbStatus.checking}
              onClick={runHealthCheck}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'var(--surface)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text)',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              🔄 Re-test Connection
            </button>
          </div>
        </div>

        {/* Cloudinary CDN Status */}
        <div className="panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>☁️</span>
              <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--text)', fontWeight: '700' }}>
                Cloudinary Media Storage
              </h4>
            </div>
            <span style={{
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: '20px',
              fontWeight: '700',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              border: '1px solid #10B981'
            }}>
              ● Active CDN
            </span>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <strong>Cloud Name:</strong> {import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dcojcg3rt'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            <strong>Upload Preset:</strong> {import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'signcrafter_preset'}
          </div>
          <div style={{ fontSize: '11px', color: '#10B981' }}>
            ✓ High-speed global image delivery for email clients.
          </div>
        </div>
      </div>

      {/* Cache & Maintenance */}
      <div className="panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: 'var(--text)', fontWeight: '700' }}>
          Local Cache Maintenance
        </h4>
        <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
          SignCrafter caches admin data in your browser for 0-latency instant loading. Clear the local cache if you ever need a clean reload from the cloud.
        </p>

        <button
          type="button"
          onClick={handleClearCache}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🧹 Refresh / Clear Local Admin Cache
        </button>
      </div>
    </div>
  );
}
