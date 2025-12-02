import { useLanguage } from '../../context/LanguageContext';
import EditableText from '../EditableText';

export default function HeroSlide({ isActive }) {
    const { t } = useLanguage();

    return (
        <div className={`slide hero-slide ${isActive ? 'active' : ''}`} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '4rem' }}>
            <div className="content-wrapper fade-up-stagger">
                <div className="tag fade-item">
                    <img
                        src="/assets/bnb.png"
                        alt="Binance Smart Chain"
                        style={{ height: '1.2em', verticalAlign: 'text-bottom', marginRight: '0.5rem' }}
                    />
                    <EditableText textKey="hero_tag" as="span" />
                </div>
                
                <div className="hero-logo-container fade-item">
                    <img
                        src="/assets/logo.svg"
                        alt="Oikos Protocol Logo"
                        className="hero-main-logo"
                    />
                </div>

                <div className="hero-text-content fade-item">
                    <EditableText textKey="hero_title" as="h1" className="main-title" />
                    <EditableText textKey="hero_subtitle" as="p" className="sub-title" />
                </div>

                <div className="hero-actions fade-item">
                    <button className="btn-primary">
                        Launch App
                    </button>
                    <button className="btn-secondary">
                        Read Documentation
                    </button>
                </div>

                {/* <div className="hero-features fade-item">
                    <div className="feature-pill">
                        <span className="pill-icon">⚖️</span>
                        <EditableText textKey="hero_fairness_title" as="span" />
                    </div>
                    <div className="feature-pill">
                        <span className="pill-icon">💧</span>
                        <EditableText textKey="hero_liquidity_title" as="span" />
                    </div>
                </div> */}
            </div>
        </div>
    );
}
