import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.svg';
import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="app-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="footer-logo-container">
                        <img src={logo} alt="Oikos Logo" className="footer-logo" />
                        <span className="footer-brand-name">Oikos</span>
                    </div>
                    <p className="footer-tagline">
                        Revolutionizing DeFi with fairness and sustainable yields.
                    </p>
                </div>

                <div className="footer-links-grid">
                    <div className="footer-column">
                        <h4>Protocol</h4>
                        <a href="#mission">Mission</a>
                        <a href="#token">Tokenomics</a>
                        <a href="#roadmap">Roadmap</a>
                        {/* <a href="#whitepaper">Whitepaper</a> */}
                    </div>
                    <div className="footer-column">
                        <h4>Community</h4>
                        <a href="https://t.me/oikoscash" target="_blank" rel="noopener noreferrer">Telegram</a>
                        <a href="https://x.com/oikos_cash" target="_blank" rel="noopener noreferrer">Twitter / X</a>
                        <a href="https://discord.gg/Pk6uTsyv3K" target="_blank" rel="noopener noreferrer">Discord</a>
                        <a href="https://medium.com/@oikoscash" target="_blank" rel="noopener noreferrer">Medium</a>
                    </div>
                    <div className="footer-column">
                        <h4>Legal</h4>
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/terms">Terms of Service</a>
                        <a href="/disclaimer">Disclaimer</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} Oikos Protocol. All rights reserved.</p>
            </div>
        </footer>
    );
}
