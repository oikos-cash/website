import { useLanguage } from '../../context/LanguageContext';
import EditableText from '../EditableText';

export default function LaunchpadSlide({ isActive }) {
    const { t } = useLanguage();

    return (
        <div className={`slide ${isActive ? 'active' : ''}`}>
            <div className="content-wrapper">
                <EditableText textKey="launchpad_eyebrow" as="h3" />
                <EditableText textKey="launchpad_title" as="h2" />
                <EditableText textKey="launchpad_text" as="p" />

                <div className="grid-2">
                    <div className="card">
                        <div className="highlight"><EditableText textKey="launchpad_card_1_title" as="span" /></div>
                        <EditableText textKey="launchpad_card_1_text" as="p" />
                    </div>
                    <div className="card">
                        <div className="highlight"><EditableText textKey="launchpad_card_2_title" as="span" /></div>
                        <EditableText textKey="launchpad_card_2_text" as="p" />
                    </div>
                </div>
                
                <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                     <div className="highlight" style={{ marginBottom: '0.5rem' }}>
                        <EditableText textKey="launchpad_ai_title" as="span" />
                     </div>
                     <EditableText textKey="launchpad_ai_text" as="p" style={{ margin: 0, fontSize: '0.9rem' }} />
                </div>
            </div>
        </div>
    );
}
