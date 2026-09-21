import React, { useState, useEffect } from 'react';
import { useSignatureStore } from '../store/useSignatureStore';

export default function FloatingControls({ hasMobileTabs = false }) {
  const { theme, toggleTheme } = useSignatureStore();
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero-section');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        // Show when scrolled down past the hero section (bottom of hero goes above top area)
        setShowTopBtn(rect.bottom < 150);
      } else {
        // Fallback for pages without hero section: show after scrolling 300px
        const windowScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const landingContainer = document.getElementById('landing-scroll-container');
        const landingScroll = landingContainer ? landingContainer.scrollTop : 0;
        const editorPanel = document.getElementById('editorPanel');
        const editorScroll = editorPanel ? editorPanel.scrollTop : 0;
        const mainContainer = document.querySelector('.main-container');
        const mainScroll = mainContainer ? mainContainer.scrollTop : 0;
        const maxScroll = Math.max(windowScroll, landingScroll, editorScroll, mainScroll);

        setShowTopBtn(maxScroll > 300);
      }
    };

    // Listen with capture to intercept scroll events from any nested scroll containers
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });

    const scrollContainers = document.querySelectorAll(
      '#landing-scroll-container, #editorPanel, #previewPanel, .main-container, .panel'
    );
    scrollContainers.forEach((el) => {
      try {
        el.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        el.scrollTop = 0;
      }
    });
  };

  return (
    <>
      {/* Bottom-Left: Rounded Dark/Light Mode Toggle Button */}
      <button
        type="button"
        onClick={toggleTheme}
        className={`floating-theme-btn ${hasMobileTabs ? 'with-mobile-dock' : ''}`}
        aria-label="Toggle Theme"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {theme === 'dark' ? (
          /* Sun Icon for Dark Mode */
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: '#FBBF24' }}
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          /* Moon Icon for Light Mode */
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: '#3B82F6' }}
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      {/* Bottom-Right: Rounded Back to Top Button (visible only when scrolled past hero) */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`floating-top-btn ${hasMobileTabs ? 'with-mobile-dock' : ''} ${showTopBtn ? 'visible' : ''}`}
        aria-label="Back to Top"
        title="Back to Top"
        tabIndex={showTopBtn ? 0 : -1}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </>
  );
}
