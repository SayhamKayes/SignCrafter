import React from 'react';

export default function AdminNavbar({ activeTab, onSelectTab, onLogout, onGoHome }) {
  const tabs = [
    { id: 'templates', label: '🎨 Templates', desc: 'Layouts & HTML' },
    { id: 'socials', label: '🌐 Social Icons', desc: 'Colors & Cloudinary' },
    { id: 'contacts', label: '📞 Contact Icons', desc: 'Custom PNGs' },
    { id: 'system', label: '⚙️ DB & Storage', desc: 'Firestore / Cache' }
  ];

  return (
    <header 
      className="navbar" 
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50, 
        borderBottom: '1px solid var(--glass-border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '12px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}
    >
      {/* Brand & Mode */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div 
          onClick={onGoHome}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          title="Go to main app"
        >
          <img src="./SignCrafter-logo.png" alt="SignCrafter" style={{ height: '32px' }} />
        </div>
        <span style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.2))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: 'var(--primary)',
          fontSize: '11px',
          fontWeight: '700',
          padding: '4px 10px',
          borderRadius: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Admin Panel
        </span>
      </div>

      {/* Center Nav Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: activeTab === tab.id ? '1px solid var(--primary)' : '1px solid transparent',
              background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === tab.id ? '700' : '500',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          type="button"
          onClick={onGoHome}
          className="btn"
          style={{
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--glass-border)',
            padding: '7px 14px',
            fontSize: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="View public generator"
        >
          <span>👁️ View App</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '7px 14px',
            fontSize: '12px',
            fontWeight: '600',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
          title="Sign out of admin session"
        >
          <span>🚪 Logout</span>
        </button>
      </div>
    </header>
  );
}
