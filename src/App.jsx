import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LivePreview from './components/Preview/LivePreview';
import PersonalDetails from './components/Editor/PersonalDetails';
import GlobalSettings from './components/Editor/GlobalSettings';
import ContactManager from './components/Editor/ContactManager';
import ImageUpload from './components/Editor/ImageUpload';
import SocialManager from './components/Editor/SocialManager';
import TemplateSelector from './components/Preview/TemplateSelector';
import ActionButtons from './components/Preview/ActionButtons';
import TypographySettings from './components/Editor/TypographySettings';
import OnboardingWizard from './components/Onboarding/OnboardingWizard';
import { useSignatureStore } from './store/useSignatureStore';
import ParticleBackground from './components/ParticleBackground';
import LandingPage from './components/Onboarding/LandingPage';
import FloatingControls from './components/FloatingControls';
import AuthModal from './components/Auth/AuthModal';
import AdminApp from './admin/AdminApp';

const checkIsAdmin = () => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = new URLSearchParams(window.location.search);
  return path.endsWith('/admin') || hash === '#admin' || hash === '#/admin' || search.get('page') === 'admin';
};

export default function App() {
  const { isOnboardingComplete } = useSignatureStore();
  const [showLanding, setShowLanding] = useState(!isOnboardingComplete);
  const [activeTab, setActiveTab] = useState('preview');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isAdminView, setIsAdminView] = useState(checkIsAdmin());

  // Listen for screen size changes and route / hash changes
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    const handleLocationChange = () => setIsAdminView(checkIsAdmin());

    window.addEventListener('resize', handleResize);
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateHome = () => {
    if (window.location.hash.includes('admin')) {
      window.location.hash = '';
    }
    if (window.location.pathname.endsWith('/admin')) {
      window.history.pushState({}, '', window.location.pathname.replace(/\/admin\/?$/, '/') || '/');
    }
    setIsAdminView(false);
  };

  // --- ADMIN ROUTE VIEW ---
  if (isAdminView) {
    return (
      <>
        <ParticleBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AdminApp onExitAdmin={navigateHome} />
        </div>
        <FloatingControls />
      </>
    );
  }

  // --- Landing Page ---
  if (showLanding) {
    return (
      <>
        <ParticleBackground />
        {/* Note: overflowY: 'auto' is crucial here so users can scroll down your long landing page! */}
        <div id="landing-scroll-container" style={{ position: 'relative', zIndex: 1, height: '100vh', overflowY: 'auto' }}>
          <LandingPage onStart={() => setShowLanding(false)} />
        </div>
        <FloatingControls />
        <AuthModal />
      </>
    );
  }

  // --- THE GATEKEEPER ---
  if (!isOnboardingComplete) {
    return (
      <>
        <ParticleBackground />
        <div style={{ position: 'relative', zIndex: 1, height: '100vh', overflow: 'hidden' }}>
          <OnboardingWizard />
        </div>
        <FloatingControls />
        <AuthModal />
      </>
    );
  }

  // Function to render only the selected tab's content on mobile
  const renderMobileContent = () => {
    switch (activeTab) {
      case 'template':
        return <div className="panel"><TemplateSelector /></div>;
      case 'settings':
        return <div className="panel"><GlobalSettings /><TypographySettings /></div>;
      case 'personal':
        return (
          <div className="panel">
            <PersonalDetails />
            <ContactManager />
            <ImageUpload />
          </div>
        );
      case 'social':
        return <div className="panel"><SocialManager /></div>;
      case 'preview':
      default:
        return (
          <div className="panel">
            <h2 style={{ marginTop: '0px' }}>Live Preview</h2>
            <LivePreview />
            <ActionButtons />
          </div>
        );
    }
  };

  return (
    <>
      <ParticleBackground />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Navbar onGoHome={() => setShowLanding(true)} />

        {isMobile ? (
          // --- MOBILE LAYOUT ---
          <>
            <main className="main-container" style={{ paddingBottom: '80px', overflowY: 'auto' }}>
              {renderMobileContent()}
            </main>

            {/* Bottom Native Tab Bar */}
            <div className="mobile-tabs">
              <button className={`tab-btn ${activeTab === 'template' ? 'active' : ''}`} onClick={() => setActiveTab('template')}>
                <span style={{ fontSize: '20px' }}>🎨</span>
                <span>Template</span>
              </button>
              <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                <span style={{ fontSize: '20px' }}>⚙️</span>
                <span>Settings</span>
              </button>
              <button className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>
                <span style={{ fontSize: '20px' }}>👤</span>
                <span>Details</span>
              </button>
              <button className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`} onClick={() => setActiveTab('social')}>
                <span style={{ fontSize: '20px' }}>🔗</span>
                <span>Socials</span>
              </button>
              <button className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>
                <span style={{ fontSize: '20px' }}>👀</span>
                <span>Preview</span>
              </button>
            </div>
          </>
        ) : (
          // --- DESKTOP LAYOUT ---
          <main className="main-container">
            {/* Left Panel: Editor */}
            <div className="panel" id="editorPanel">
              <TemplateSelector />
              <GlobalSettings />
              <TypographySettings />
              <div style={{ marginTop: '30px' }}></div>
              <PersonalDetails />
              <ContactManager />
              <ImageUpload />
              <SocialManager />
            </div>

            {/* Right Panel: Preview */}
            <div className="panel" id="previewPanel">
              <h2 style={{ marginTop: '24px' }}>Live Preview</h2>
              <LivePreview />
              <ActionButtons />
            </div>
          </main>
        )}
      </div>
      <FloatingControls hasMobileTabs={isMobile} />
      <AuthModal />
    </>
  );
}