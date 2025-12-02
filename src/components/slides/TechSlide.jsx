import { useLanguage } from '../../context/LanguageContext';
import EditableText from '../EditableText';

export default function TechSlide({ isActive }) {
    const { t, tHtml } = useLanguage();

    return (
        <div className={`slide ${isActive ? 'active' : ''}`}>
            <div className="content-wrapper">
                <EditableText textKey="tech_eyebrow" as="h3" />
                <EditableText textKey="tech_title" as="h2" />
                <EditableText textKey="tech_text" as="p" />

                <div style={{ marginTop: '2rem' }}>
                    <div className="roadmap-item">
                        <EditableText textKey="tech_item_1_date" as="div" className="roadmap-date" style={{ color: 'var(--accent-tertiary)' }} />
                        <EditableText textKey="tech_item_1_text" as="div" html />
                    </div>
                    <div className="roadmap-item">
                        <EditableText textKey="tech_item_2_date" as="div" className="roadmap-date" style={{ color: 'var(--accent-tertiary)' }} />
                        <EditableText textKey="tech_item_2_text" as="div" html />
                    </div>
                    <div className="roadmap-item">
                        <EditableText textKey="tech_item_3_date" as="div" className="roadmap-date" style={{ color: 'var(--accent-tertiary)' }} />
                        <EditableText textKey="tech_item_3_text" as="div" html />
                    </div>
                </div>

                <div className="chart-placeholder" style={{ height: '150px', marginTop: '2rem' }}>
                    <svg width="400" height="120" viewBox="0 0 400 120" fill="none">
                        <defs>
                            <linearGradient id="floorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--accent-tertiary)" stopOpacity="0.3"/>
                                <stop offset="100%" stopColor="var(--accent-tertiary)" stopOpacity="0"/>
                            </linearGradient>
                        </defs>
                        <line x1="20" y1="100" x2="380" y2="100" stroke="var(--border-color)" strokeWidth="1" />
                        <line x1="20" y1="100" x2="20" y2="10" stroke="var(--border-color)" strokeWidth="1" />
                        <path d="M20 90 L80 90 L80 75 L160 75 L160 60 L240 60 L240 40 L320 40 L320 20 L380 20" stroke="var(--accent-tertiary)" strokeWidth="2" fill="none" />
                        <path d="M20 90 L80 90 L80 75 L160 75 L160 60 L240 60 L240 40 L320 40 L320 20 L380 20 L380 100 L20 100 Z" fill="url(#floorGradient)" />
                        <path d="M20 85 Q50 70 80 85 T140 70 T200 50 T280 30 T360 15" stroke="var(--accent-primary)" strokeWidth="1.5" strokeDasharray="4 2" fill="none" opacity="0.7"/>
                        <text x="300" y="90" fill="var(--accent-tertiary)" fontSize="10" fontFamily="monospace">RATCHETING FLOOR</text>
                    </svg>
                </div>
            </div>
        </div>
    );
}
