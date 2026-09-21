import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminNavbar from './AdminNavbar';
import TemplateManagerAdmin from './sections/TemplateManagerAdmin';
import SocialManagerAdmin from './sections/SocialManagerAdmin';
import ContactIconsAdmin from './sections/ContactIconsAdmin';
import SystemStatusAdmin from './sections/SystemStatusAdmin';

export default function AdminApp({ onExitAdmin }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');

  useEffect(() => {
    const session = sessionStorage.getItem('signcrafter_admin_session');
    if (session === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('signcrafter_admin_session');
    sessionStorage.removeItem('signcrafter_admin_login_time');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} onGoHome={onExitAdmin} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      color: 'var(--text)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <AdminNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
        onGoHome={onExitAdmin}
      />

      <main style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'templates' && <TemplateManagerAdmin />}
        {activeTab === 'socials' && <SocialManagerAdmin />}
        {activeTab === 'contacts' && <ContactIconsAdmin />}
        {activeTab === 'system' && <SystemStatusAdmin />}
      </main>

      <footer style={{
        padding: '16px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '12px',
        borderTop: '1px solid var(--glass-border)',
        background: 'var(--glass-bg)'
      }}>
        SignCrafter Admin Console • Authorized Personnel Only
      </footer>
    </div>
  );
}
