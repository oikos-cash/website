import { useLanguage } from '../../context/LanguageContext';
import EditableText from '../EditableText';

export default function RoadmapSlide({ isActive }) {
    const { t } = useLanguage();

    return (
        <div className={`slide ${isActive ? 'active' : ''}`}>
            <div className="content-wrapper">
                <EditableText textKey="roadmap_eyebrow" as="h3" />
                <EditableText textKey="roadmap_title" as="h2" />

                <div className="card" style={{ width: '100%', boxSizing: 'border-box' }}>
                    <div className="roadmap-item">
                        <EditableText textKey="roadmap_item_1_date" as="div" className="roadmap-date" style={{ color: 'var(--accent-tertiary)' }} />
                        <div>
                            <strong>
                                <img src="/assets/bnb.png" alt="Binance Smart Chain" style={{ height: '1em', verticalAlign: 'text-bottom', marginRight: '0.3rem' }}/>
                                <EditableText textKey="roadmap_item_1_title" as="span" />
                            </strong>
                            <br/><EditableText textKey="roadmap_item_1_text" as="span" />
                        </div>
                    </div>
                    <div className="roadmap-item">
                        <EditableText textKey="roadmap_item_2_date" as="div" className="roadmap-date" />
                        <div><EditableText textKey="roadmap_item_2_title" as="strong" /><br/><EditableText textKey="roadmap_item_2_text" as="span" /></div>
                    </div>
                    <div className="roadmap-item">
                        <EditableText textKey="roadmap_item_3_date" as="div" className="roadmap-date" />
                        <div><EditableText textKey="roadmap_item_3_title" as="strong" /><br/><EditableText textKey="roadmap_item_3_text" as="span" /></div>
                    </div>
                    <div className="roadmap-item">
                        <EditableText textKey="roadmap_item_4_date" as="div" className="roadmap-date" />
                        <div><EditableText textKey="roadmap_item_4_title" as="strong" /><br/><EditableText textKey="roadmap_item_4_text" as="span" /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
