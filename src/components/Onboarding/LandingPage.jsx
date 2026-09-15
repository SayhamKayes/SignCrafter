import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LandingPage({ onStart }) {
    // 1. State to track the current theme
    const [isDark, setIsDark] = useState(false);

    // 2. Effect to apply the theme to the document root whenever isDark changes
    useEffect(() => {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [isDark]);

    // 3. Toggle handler function
    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    // Animation variants for reusability
    const fadeUpVariant = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <div style={{ minHeight: '100vh', overflowY: 'auto' }}>

            {/* --- Header --- */}
            <motion.header 
                className="navbar"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="nav-brand">
                    <img
                        src="./SignCrafter-logo.png"
                        alt="SignCrafter Logo"
                        className="nav-logo"
                    />
                </div>
                <button
                    onClick={toggleTheme}
                    className="theme-btn"
                >
                    {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
            </motion.header>

            {/* --- Hero Section --- */}
            <motion.section 
                style={{ textAlign: 'center', padding: '80px 20px' }}
                initial="hidden"
                animate="visible"
                variants={fadeUpVariant}
            >
                <h1 style={{ fontSize: '48px', fontWeight: '900', margin: '0 0 20px 0', color: 'var(--text)' }}>
                    Create a professional email <br /> signature in minutes.
                </h1>
                <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
                    Boost your professional brand with our free signature generator. Choose from premium templates, add your details, and export directly to Gmail, Outlook, or Apple Mail.
                </p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onStart}
                    className="btn"
                    style={{ width: 'auto', padding: '15px 35px', fontSize: '18px', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)' }}
                >
                    Start Generating Now
                </motion.button>

                {/* Abstract Hero Image/Graphic */}
                <motion.div 
                    style={{ marginTop: '60px', display: 'flex', justifyContent: 'center' }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <div className="panel" style={{ width: '80%', maxWidth: '800px', padding: '12px', overflow: 'hidden' }}>
                        <img 
                            src="./hero-image.jpg" 
                            alt="Signature Preview Graphic" 
                            style={{ 
                                width: '100%', 
                                height: 'auto', 
                                display: 'block', 
                                borderRadius: '8px' 
                            }}
                        />
                    </div>
                </motion.div>
            </motion.section>

            {/* --- Feature Highlight Section --- */}
            <section style={{ padding: '100px 20px', backgroundColor: 'var(--glass-bg)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                
                {/* Instruction 1 */}
                <motion.div 
                    initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUpVariant}
                    style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '50px', maxWidth: '1000px', margin: '0 auto 100px' }}
                >
                    <div style={{ flex: '1 1 450px' }}>
                        <div style={{ width: '100%', height: 'auto', backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                            <img src="./instruction-image-1.png" alt="Instruction" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                        </div>
                    </div>
                    <div style={{ flex: '1 1 350px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '20px', color: 'var(--text)' }}>Select Base Design</h2>
                        <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '25px' }}>
                            Browse curated collection of professional email signature blueprints. Choose from high-impact templates and instantly preview styles to match your brand.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.8' }}>
                            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Diverse gallery of modern design templates.</li>
                            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Instant live previews of different signature styles.</li>
                            <li style={{ display: 'flex', alignItems: 'center' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Universally responsive layouts tested across devices.</li>
                        </ul>
                    </div>
                </motion.div>

                {/* Instruction 2 */}
                <motion.div 
                    initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUpVariant}
                    style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '50px', maxWidth: '1000px', margin: '0 auto 100px' }}
                >
                    <div style={{ flex: '1 1 350px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '20px', color: 'var(--text)' }}>Choose Theme</h2>
                        <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '25px' }}>
                            Control global visual style. Use intuitive palette editor to define hex codes for text and unify design by choosing specific shapes for icons.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.8' }}>
                            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Define exact hex codes for every visual element.</li>
                            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Change contact and social icon shapes instantly.</li>
                            <li style={{ display: 'flex', alignItems: 'center' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Apply consistent branding across entire signature.</li>
                        </ul>
                    </div>
                    <div style={{ flex: '1 1 450px' }}>
                        <div style={{ width: '100%', height: 'auto', backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                            <img src="./instruction-image-2.png" alt="Instruction" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                        </div>
                    </div>
                </motion.div>

                {/* Instruction 3 */}
                <motion.div 
                    initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUpVariant}
                    style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '50px', maxWidth: '1000px', margin: '0 auto 100px' }}
                >
                    <div style={{ flex: '1 1 450px' }}>
                        <div style={{ width: '100%', height: 'auto', backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                            <img src="./instruction-image-3.png" alt="Instruction" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                        </div>
                    </div>
                    <div style={{ flex: '1 1 350px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '20px', color: 'var(--text)' }}>Perfect Typography</h2>
                        <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '25px' }}>
                            Elevate legibility and brand alignment with comprehensive typography controls. Independently style specific sections with custom font families, weights, and text transforms.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.8' }}>
                            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Full font family selection for individual sections.</li>
                            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Adjust specific font weights and typographic styles.</li>
                            <li style={{ display: 'flex', alignItems: 'center' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Control text transforms like capitalization easily.</li>
                        </ul>
                    </div>
                </motion.div>

                {/* Instruction 4 */}
                <motion.div 
                    initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUpVariant}
                    style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '50px', maxWidth: '1000px', margin: '0 auto 100px' }}
                >
                    <div style={{ flex: '1 1 350px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '20px', color: 'var(--text)' }}>Organize & Enter Information</h2>
                        <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '25px' }}>
                            Quickly set up profile with easy form-filling process. Enter key details like name, title, company, and location to build the foundation of signature.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.8' }}>
                            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Easy photo upload and data entry forms.</li>
                            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Auto-populate from external sources to save time.</li>
                            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Add and organize unlimited contact methods.</li>
                            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Reorder contact list to highlight preferred priority.</li>
                        </ul>
                    </div>
                    <div style={{ flex: '1 1 450px' }}>
                        <div style={{ width: '100%', height: 'auto', backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                            <img src="./instruction-image-4.png" alt="Instruction" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                        </div>
                    </div>
                </motion.div>

                {/* Instruction 5 */}
                <motion.div 
                    initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUpVariant}
                    style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '50px', maxWidth: '1000px', margin: '0 auto 100px' }}
                >
                    <div style={{ flex: '1 1 450px' }}>
                        <div style={{ width: '100%', height: 'auto', backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                            <img src="./instruction-image-5.png" alt="Instruction" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                        </div>
                    </div>
                    <div style={{ flex: '1 1 350px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '20px', color: 'var(--text)' }}>Integrate Visual Brand</h2>
                        <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '25px' }}>
                            Anchor signature with high-quality assets. Upload profile picture, logo, and banner, then scaling engine to precisely adjust them for a flawless fit.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.8' }}>
                            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Upload profiles, logos, and banners with spec guidance.</li>
                            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Independently adjust display sizes for each asset.</li>
                        </ul>
                    </div>
                </motion.div>

                {/* Instruction 6 */}
                <motion.div 
                    initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUpVariant}
                    style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '50px', maxWidth: '1000px', margin: '0 auto 100px' }}
                >
                    <div style={{ flex: '1 1 350px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '20px', color: 'var(--text)' }}>Sync Social Presence</h2>
                        <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '25px' }}>
                            Expand professional network effortlessly. Select from massive library of icons to represent active platforms, then simply add unique handles.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.8' }}>
                            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Pick from a vast selection of active platform icons.</li>
                            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Link icons to profiles by simply adding URLs.</li>
                            <li style={{ display: 'flex', alignItems: 'center' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Reorder social links to ensure key profiles are prioritized.</li>
                        </ul>
                    </div>
                    <div style={{ flex: '1 1 450px' }}>
                        <div style={{ width: '100%', height: 'auto', backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                            <img src="./instruction-image-6.png" alt="Instruction" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                        </div>
                    </div>
                </motion.div>

                {/* Instruction 7 */}
                <motion.div 
                    initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUpVariant}
                    style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '50px', maxWidth: '1000px', margin: '0 auto' }}
                >
                    <div style={{ flex: '1 1 450px' }}>
                        <div style={{ width: '100%', height: 'auto', backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                            <img src="./instruction-image-7.png" alt="Instruction" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                        </div>
                    </div>
                    <div style={{ flex: '1 1 350px' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '20px', color: 'var(--text)' }}>Live Preview & Export</h2>
                        <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '25px' }}>
                            See exactly how signature will look in a real email client. Copy the signature directly or download the source file for easy deployment.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.8' }}>
                            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Real-time email client preview.</li>
                            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> One-click "Copy Signature" functionality.</li>
                            <li style={{ display: 'flex', alignItems: 'center' }}><span style={{ color: 'var(--primary)', marginRight: '12px', fontSize: '20px' }}>✓</span> Download the raw source file for manual setup.</li>
                        </ul>
                    </div>
                </motion.div>
            </section>

            {/* --- Hero Section --- */}
            <motion.section 
                style={{ textAlign: 'center', padding: '80px 20px' }}
                initial="hidden"
                animate="visible"
                variants={fadeUpVariant}
            >
                {/* Abstract Hero Image/Graphic */}
                <motion.div 
                    style={{ margin: '60px 0', display: 'flex', justifyContent: 'center' }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <div className="panel" style={{ width: '80%', maxWidth: '800px', padding: '12px', overflow: 'hidden' }}>
                        <img 
                            src="./hero-image.jpg" 
                            alt="Signature Preview Graphic" 
                            style={{ 
                                width: '100%', 
                                height: 'auto', 
                                display: 'block', 
                                borderRadius: '8px' 
                            }}
                        />
                    </div>
                </motion.div>
            </motion.section>

            {/* --- How It Works (Instructions) --- */}
            <section style={{ padding: '80px 20px', textAlign: 'center', background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)', maxWidth: '100%', boxSizing: 'border-box' }}>
                <motion.h2 
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                    style={{ fontSize: '32px', fontWeight: '800', marginBottom: '50px', color: 'var(--text)', border: 'none' }}
                >
                    How it works
                </motion.h2>

                <motion.div 
                    variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto', boxSizing: 'border-box' }}
                >
                    {/* Step 1 */}
                    <motion.div variants={fadeUpVariant} className="panel" style={{ padding: '30px', textAlign: 'center' }}>
                        <div style={{ background: 'var(--input-bg)', color: 'var(--primary)', border: '1px solid var(--glass-border)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', margin: '0 auto 20px auto' }}>1</div>
                        <h3 style={{ fontSize: '20px', marginBottom: '10px', color: 'var(--text)', marginTop: '0' }}>Enter Your Details</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>Fill out your personal information, upload your profile picture, and add your social media links.</p>
                    </motion.div>

                    {/* Step 2 */}
                    <motion.div variants={fadeUpVariant} className="panel" style={{ padding: '30px', textAlign: 'center' }}>
                        <div style={{ background: 'var(--input-bg)', color: 'var(--primary)', border: '1px solid var(--glass-border)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', margin: '0 auto 20px auto' }}>2</div>
                        <h3 style={{ fontSize: '20px', marginBottom: '10px', color: 'var(--text)', marginTop: '0' }}>Choose a Template</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>Select from our library of professionally designed templates and customize the brand colors to match your style.</p>
                    </motion.div>

                    {/* Step 3 */}
                    <motion.div variants={fadeUpVariant} className="panel" style={{ padding: '30px', textAlign: 'center' }}>
                        <div style={{ background: 'var(--input-bg)', color: 'var(--primary)', border: '1px solid var(--glass-border)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', margin: '0 auto 20px auto' }}>3</div>
                        <h3 style={{ fontSize: '20px', marginBottom: '10px', color: 'var(--text)', marginTop: '0' }}>Export to Client</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>Click copy and simply paste your new signature directly into your favorite email client's settings.</p>
                    </motion.div>

                </motion.div>
            </section>

            {/* --- Footer CTA --- */}
            <div style={{ padding: '0 20px' }}>
                <motion.section 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                    className="panel" 
                    style={{ margin: '100px auto', maxWidth: '1000px', backgroundColor: 'var(--primary)', color: '#fff', textAlign: 'center', border: 'none', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)', padding: '60px 40px' }}
                >
                    <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '20px', color: '#fff' }}>Ready to stand out?</h2>
                    <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '30px' }}>Join thousands of professionals upgrading their emails today.</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onStart}
                        className="btn"
                        style={{ background: '#fff', color: 'var(--primary)', width: 'auto', padding: '15px 35px', fontSize: '16px' }}
                    >
                        Create Signature Now
                    </motion.button>
                </motion.section>
            </div>

            {/* --- Simple Footer --- */}
            <footer style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', borderTop: '1px solid var(--glass-border)', background: 'var(--glass-bg)', backdropFilter: 'blur(12px)' }}>
                &copy; {new Date().getFullYear()} SignCrafter | All rights reserved by <a style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }} href="https://sayhamkayes.vercel.app/" rel="nofollow" target='_blank'>Sayham Kayes</a>
            </footer>

        </div>
    );
}