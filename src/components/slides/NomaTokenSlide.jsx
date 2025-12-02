import { useLanguage } from '../../context/LanguageContext';
import EditableText from '../EditableText';
import InfoIcon from '../InfoIcon';

export default function NomaTokenSlide({ isActive }) {
    const { t } = useLanguage();

    return (
        <div className={`slide ${isActive ? 'active' : ''}`}>
            <div className="content-wrapper">
                <EditableText textKey="noma_token_eyebrow" as="h3" />
                <EditableText textKey="noma_token_title" as="h2" />
                <EditableText textKey="noma_token_text" as="p" />

                <div className="grid-2">
                    <div>
                        <div className="card">
                            <div className="highlight">
                                <EditableText textKey="noma_token_card_1_title" as="span" />
                                {/* <InfoIcon type="dividends" /> */}
                            </div>
                            <EditableText textKey="noma_token_card_1_text" as="p" />
                        </div>
                        <div className="card" style={{ marginTop: '1rem' }}>
                            <div className="highlight"><EditableText textKey="noma_token_card_2_title" as="span" /></div>
                            <EditableText textKey="noma_token_card_2_text" as="p" />
                        </div>
                    </div>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                         <div className="highlight" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <EditableText textKey="noma_token_mechanism_title" as="span" />
                         </div>
                         <div className="chart-placeholder" style={{ height: '120px', margin: '1rem 0' }}>
                            <svg width="100%" height="100%" viewBox="0 0 300 100" fill="none">
                                <rect x="10" y="40" width="280" height="20" rx="10" fill="rgba(255,255,255,0.1)" />
                                <rect x="10" y="40" width="140" height="20" rx="10" fill="var(--accent-primary)">
                                    <animate attributeName="width" values="0;280" dur="3s" repeatCount="indefinite" />
                                </rect>
                                <text x="150" y="30" fill="var(--accent-tertiary)" fontSize="10" textAnchor="middle">180 DAYS LINEAR RELEASE</text>
                                <text x="10" y="80" fill="white" fontSize="10">T0: DIVIDEND</text>
                                <text x="290" y="80" fill="white" fontSize="10" textAnchor="end">T180: FULLY VESTED</text>
                            </svg>
                         </div>
                         <EditableText textKey="noma_token_mechanism_text" as="p" style={{ textAlign: 'center', fontSize: '0.85rem' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
