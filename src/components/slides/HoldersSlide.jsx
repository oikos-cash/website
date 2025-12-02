import { useLanguage } from '../../context/LanguageContext';
import EditableText from '../EditableText';

export default function HoldersSlide({ isActive }) {
    const { t } = useLanguage();

    return (
        <div className={`slide ${isActive ? 'active' : ''}`}>
            <div className="content-wrapper">
                <EditableText textKey="holders_eyebrow" as="h3" />
                <EditableText textKey="holders_title" as="h2" />
                <EditableText textKey="holders_text" as="p" />

                <div className="grid-2">
                    <div>
                        <div className="card" style={{ height: '100%', boxSizing: 'border-box' }}>
                            <div className="highlight"><EditableText textKey="holders_card_title" as="span" /></div>
                            <EditableText textKey="holders_card_text" as="p" style={{ marginTop: '1rem' }} />
                            <ul style={{ marginTop: '1.5rem' }}>
                                <li><EditableText textKey="holders_list_1_title" as="strong" /> <EditableText textKey="holders_list_1_text" as="span" /></li>
                                <li><EditableText textKey="holders_list_2_title" as="strong" /> <EditableText textKey="holders_list_2_text" as="span" /></li>
                            </ul>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                        <div className="chart-placeholder" style={{ height: '180px' }}>
                            <svg width="400" height="150" viewBox="0 0 400 150" fill="none">
                                <defs>
                                    <linearGradient id="streamGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="var(--accent-secondary)" stopOpacity="0.1"/>
                                        <stop offset="50%" stopColor="var(--accent-secondary)" stopOpacity="0.8"/>
                                        <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="1"/>
                                    </linearGradient>
                                </defs>
                                <circle cx="50" cy="30" r="15" fill="#ef4444" opacity="0.8">
                                    <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
                                </circle>
                                <circle cx="50" cy="75" r="15" fill="#10b981" opacity="0.8">
                                    <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite"/>
                                </circle>
                                <circle cx="50" cy="120" r="15" fill="#fbbf24" opacity="0.8">
                                    <animate attributeName="opacity" values="0.8;1;0.8" dur="2.5s" repeatCount="indefinite"/>
                                </circle>
                                <path d="M70 30 C150 30, 150 75, 250 75" stroke="url(#streamGradient)" strokeWidth="4" strokeDasharray="5 5">
                                    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite"/>
                                </path>
                                <path d="M70 75 C150 75, 150 75, 250 75" stroke="url(#streamGradient)" strokeWidth="4" strokeDasharray="5 5">
                                    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite"/>
                                </path>
                                <path d="M70 120 C150 120, 150 75, 250 75" stroke="url(#streamGradient)" strokeWidth="4" strokeDasharray="5 5">
                                    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite"/>
                                </path>
                                <rect x="250" y="40" width="120" height="70" rx="10" fill="rgba(22, 27, 34, 0.8)" stroke="var(--accent-primary)" strokeWidth="2"/>
                                <text x="310" y="80" fill="white" fontFamily="sans-serif" fontSize="14" textAnchor="middle" fontWeight="bold">{t('holders_graphic_title')}</text>
                                <text x="310" y="95" fill="var(--accent-tertiary)" fontFamily="sans-serif" fontSize="10" textAnchor="middle">{t('holders_graphic_sub')}</text>
                            </svg>
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--accent-tertiary)' }}>
                            <strong><EditableText textKey="holders_graphic_footer_title" as="span" /></strong><br/>
                            <EditableText textKey="holders_graphic_footer_text" as="span" style={{ color: '#9ca3af' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
