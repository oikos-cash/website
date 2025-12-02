import { useLanguage } from '../context/LanguageContext';
import { isMobile } from 'react-device-detect';

export default function LanguageSelector() {
    const { language, setLanguage } = useLanguage();

    return (
        // <div className="lang-selector">
            <div className="lang-controls-content" style={{ marginTop: isMobile ? '5px' : '10px', marginLeft: '10px' }}>
                <button
                    className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                    onClick={() => setLanguage('en')}
                >
                    EN
                </button>
                <button
                    className={`lang-btn ${language === 'es' ? 'active' : ''}`}
                    onClick={() => setLanguage('es')}
                >
                    ES
                </button>
            {/* </div> */}
        </div>
    );
}
