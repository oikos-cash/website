import { useLanguage } from '../../context/LanguageContext';
import EditableText from '../EditableText';

export default function CreatorsSlide({ isActive }) {
    const { t } = useLanguage();

    return (
        <div className={`slide ${isActive ? 'active' : ''}`}>
            <div className="content-wrapper">
                <EditableText textKey="creators_eyebrow" as="h3" />
                <EditableText textKey="creators_title" as="h2" />
                <EditableText textKey="creators_text" as="p" />

                <div className="grid-2">
                    <div>
                        <div className="card" style={{ height: '100%', boxSizing: 'border-box' }}>
                            <div className="highlight"><EditableText textKey="creators_card_title" as="span" /></div>
                            <EditableText textKey="creators_card_text" as="p" style={{ marginTop: '1rem' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                        <div className="chart-placeholder" style={{ height: '180px' }}>
                            <svg width="400" height="150" viewBox="0 0 400 150" fill="none">
                                <circle cx="200" cy="75" r="20" fill="rgba(255, 255, 255, 0.1)" stroke="var(--accent-secondary)" strokeWidth="2" />
                                <g id="creatorNodes">
                                    <circle cx="100" cy="40" r="12" fill="#fbbf24" opacity="0.8" />
                                    <circle cx="300" cy="40" r="12" fill="#fbbf24" opacity="0.8" />
                                    <circle cx="100" cy="110" r="12" fill="#fbbf24" opacity="0.8" />
                                    <circle cx="300" cy="110" r="12" fill="#fbbf24" opacity="0.8" />
                                </g>
                                <path d="M112 40 L180 75" stroke="url(#flowGradient1)" strokeWidth="2" strokeDasharray="4 4">
                                    <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1s" repeatCount="indefinite"/>
                                </path>
                                <path d="M288 40 L220 75" stroke="url(#flowGradient2)" strokeWidth="2" strokeDasharray="4 4">
                                    <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1s" repeatCount="indefinite"/>
                                </path>
                                <circle cx="200" cy="75" r="20" fill="none" stroke="var(--accent-tertiary)" strokeWidth="2" opacity="0">
                                    <animate attributeName="r" values="20; 120" dur="2s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.8; 0" dur="2s" repeatCount="indefinite" />
                                </circle>
                                <defs>
                                    <linearGradient id="flowGradient1" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#fbbf24"/>
                                        <stop offset="100%" stopColor="var(--accent-secondary)"/>
                                    </linearGradient>
                                    <linearGradient id="flowGradient2" x1="1" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#fbbf24"/>
                                        <stop offset="100%" stopColor="var(--accent-secondary)"/>
                                    </linearGradient>
                                </defs>
                                <text x="200" y="140" fill="var(--accent-tertiary)" fontFamily="sans-serif" fontSize="12" textAnchor="middle" fontWeight="bold" letterSpacing="1">{t('creators_graphic_label')}</text>
                            </svg>
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--accent-tertiary)' }}>
                            <strong><EditableText textKey="creators_footer_title" as="span" /></strong><br/>
                            <EditableText textKey="creators_footer_text" as="span" style={{ color: '#9ca3af' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
