import { useLanguage } from '../../context/LanguageContext';
import EditableText from '../EditableText';
import InfoIcon from '../InfoIcon';

export default function SolutionSlide({ isActive }) {
    const { t } = useLanguage();

    return (
        <div className={`slide ${isActive ? 'active' : ''}`}>
            <div className="content-wrapper">
                <EditableText textKey="solution_eyebrow" as="h3" />
                <EditableText textKey="solution_title" as="h2" />
                <EditableText textKey="solution_text" as="p" />

                <div className="grid-2">
                    <div className="card">
                        <div className="highlight"><EditableText textKey="solution_card_1_title" as="span" /></div>
                        <EditableText textKey="solution_card_1_text" as="p" />
                    </div>
                    <div className="card">
                        <div className="highlight">
                            <EditableText textKey="solution_card_2_title" as="span" />
                            {/* <InfoIcon /> */}
                        </div>
                        <EditableText textKey="solution_card_2_text" as="p" />
                    </div>
                    <div className="card">
                        <div className="highlight"><EditableText textKey="solution_card_3_title" as="span" /></div>
                        <EditableText textKey="solution_card_3_text" as="p" />
                    </div>
                    <div className="card">
                        <div className="highlight"><EditableText textKey="solution_card_4_title" as="span" /></div>
                        <EditableText textKey="solution_card_4_text" as="p" />
                    </div>
                </div>
            </div>
        </div>
    );
}
