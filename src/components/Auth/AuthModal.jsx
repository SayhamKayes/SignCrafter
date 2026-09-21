import React, { useState } from 'react';
import { useSignatureStore } from '../../store/useSignatureStore';
import { auth, provider, signInWithPopup } from '../../firebase';

export default function AuthModal() {
  const { authModalOpen, closeAuthModal, setCurrentUser, pendingUpload, uploadImage } = useSignatureStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!authModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };

      setCurrentUser(userData);

      // If a file was pending when the user clicked upload, proceed with upload
      if (pendingUpload?.file && pendingUpload?.imageType) {
        uploadImage(pendingUpload.file, pendingUpload.imageType);
      }

      closeAuthModal();
    } catch (err) {
      console.error("Google sign in error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in cancelled. Please complete sign-in to upload images.");
      } else if (err.code === 'auth/cancelled-popup-request') {
        // Ignored
      } else {
        setError(err.message || "Failed to sign in with Google. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--surface, var(--glass-bg))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow), 0 20px 50px rgba(0, 0, 0, 0.3)',
          borderRadius: '20px',
          padding: '32px 28px',
          position: 'relative',
          color: 'var(--text)',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '50%',
            lineHeight: 1
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Cloud Security Icon */}
        <div 
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            color: 'var(--primary)'
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
            <rect x="9" y="13" width="6" height="5" rx="1" fill="currentColor" fillOpacity="0.2"/>
          </svg>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text)' }}>
          Secure Image Storage
        </h3>

        {/* Subtitle */}
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 24px 0' }}>
          Connect your Google account to safely upload and preserve your signature assets directly into your Cloudinary folder (<strong>signcrafter images</strong>).
        </p>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
            fontSize: '12px',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '16px',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: 'var(--input-bg, #ffffff)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            padding: '12px 18px',
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          {loading ? (
            <span>Connecting with Google...</span>
          ) : (
            <>
              {/* Official Google G SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Security / Trust Highlights */}
        <div style={{
          marginTop: '24px',
          paddingTop: '18px',
          borderTop: '1px solid var(--glass-border)',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '8px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span style={{ color: '#10B981' }}>✓</span>
            <span>Dedicated Cloudinary storage in <strong>signcrafter images</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span style={{ color: '#10B981' }}>✓</span>
            <span>Your image assets are permanently linked to your Gmail account</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span style={{ color: '#10B981' }}>✓</span>
            <span>100% private, protected, and collision-free uploads</span>
          </div>
        </div>
      </div>
    </div>
  );
}
