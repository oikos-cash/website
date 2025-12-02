import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.svg'; // Assuming logo is importable, otherwise use path
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
                    <a href="#mission" className="nav-link">Mission</a>
                    <a href="#token" className="nav-link">Token</a>
                    <a href="#roadmap" className="nav-link">Roadmap</a>
                </nav>

                <div className="header-actions">
                    <button className="cta-button-small">
                        Launch App
                    </button>
                </div>
            </div>
        </header>
    );
}
