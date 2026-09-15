import { useState, useEffect } from 'react';

export default function Navbar() {
    // Initialize theme from localStorage just like your vanilla app
    const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'light');

    // Update the DOM whenever the theme changes
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('app_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <img
                    src="./SignCrafter-logo.png"
                    alt="SignCrafter Log"
                    className="nav-logo"
                    style={{ marginRight: '8px' }}
                />
                {/* <span>SignCrafter</span> */}
            </div>
            <button className="theme-btn" aria-label="Toggle Dark Mode" onClick={toggleTheme}>
                {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
        </nav>
    );
}