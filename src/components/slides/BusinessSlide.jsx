import { useLanguage } from '../../context/LanguageContext';
import EditableText from '../EditableText';
import InfoIcon from '../InfoIcon';

export default function BusinessSlide({ isActive }) {
    const { t } = useLanguage();

    return (
        <div className={`slide ${isActive ? 'active' : ''}`}>
            <div className="content-wrapper">
                <EditableText textKey="business_eyebrow" as="h3" />
                <EditableText textKey="business_title" as="h2" />
                <div className="grid-2">
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div className="big-stat"><EditableText textKey="business_card_1_stat" as="span" /></div>
                        <div className="stat-label"><EditableText textKey="business_card_1_label" as="span" /></div>
                        <EditableText textKey="business_card_1_text" as="p" style={{ fontSize: '0.9rem', marginTop: '1rem' }} />
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div className="big-stat">
                            <EditableText textKey="business_card_2_stat" as="span" />
                            {/* <InfoIcon type="dividends" /> */}
                        </div>
                        <div className="stat-label"><EditableText textKey="business_card_2_label" as="span" /></div>
                        <EditableText textKey="business_card_2_text" as="p" style={{ fontSize: '0.9rem', marginTop: '1rem' }} />
                    </div>
                </div>
                <EditableText textKey="business_quote" as="p" style={{ textAlign: 'center', marginTop: '2rem', fontStyle: 'italic' }} />
            </div>
        </div>
    );
}
