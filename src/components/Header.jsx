import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo_dark.png'; // Assuming logo is importable, otherwise use path

import './Header.css';

export default function Header() {
    const { t } = useLanguage();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        
        // Check initial scroll position
        handleScroll();
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`app-header ${scrolled ? 'scrolled' : ''}`}>
            <div className="header-container">
                <div className="logo-section">
                    <img src={logo} alt="Oikos Logo" className="header-logo" />
                </div>
                
                <nav className="header-nav">
                    <a href="#the-challenge-section" className="nav-link">Challenge</a>
                    <a href="#protocol-token-section" className="nav-link">Token</a>
                    <a href="#the-future-section" className="nav-link">Roadmap</a>
                </nav>

                <div className="header-actions">
                    <a href="https://app.oikos.cash" target="_blank" rel="noopener noreferrer">
                    <button className="cta-button-small">
                        Launch App
                    </button>
                    </a>                    
                </div>
            </div>
        </header>
    );
}
