import { useLanguage } from '../../context/LanguageContext';
import EditableText from '../EditableText';

export default function MissionSlide({ isActive }) {
    const { t } = useLanguage();

    return (
        <div className={`slide ${isActive ? 'active' : ''}`}>
            <div className="content-wrapper">
                <EditableText textKey="mission_eyebrow" as="h3" />
                <EditableText textKey="mission_title" as="h2" />
                <EditableText textKey="mission_text" as="p" />

                <div className="grid-2">
                    <div className="card">
                        <EditableText textKey="mission_card_founders_title" as="h4" style={{ color: 'white', marginTop: 0 }} />
                        <EditableText textKey="mission_card_founders_text" as="p" style={{ fontSize: '1rem' }} />
                    </div>
                    <div className="card">
                        <EditableText textKey="mission_card_holders_title" as="h4" style={{ color: 'white', marginTop: 0 }} />
                        <EditableText textKey="mission_card_holders_text" as="p" style={{ fontSize: '1rem' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
