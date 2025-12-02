import { useLanguage } from '../../context/LanguageContext';
import EditableText from '../EditableText';

export default function ProblemFoundersSlide({ isActive }) {
    const { t } = useLanguage();

    return (
        <div className={`slide ${isActive ? 'active' : ''}`}>
            <div className="content-wrapper">
                <EditableText textKey="problem_founders_eyebrow" as="h3" />
                <EditableText textKey="problem_founders_title" as="h2" />
                <div className="grid-2">
                    <div>
                        <EditableText textKey="problem_founders_text" as="p" />
                        <div style={{marginTop:"20px"}}>
                            <ul>
                                <li><EditableText textKey="problem_founders_list_1_title" as="strong" /> <EditableText textKey="problem_founders_list_1_text" as="span" /></li>
                                <li><EditableText textKey="problem_founders_list_2_title" as="strong" /> <EditableText textKey="problem_founders_list_2_text" as="span" /></li>
                                <li><EditableText textKey="problem_founders_list_3_title" as="strong" /> <EditableText textKey="problem_founders_list_3_text" as="span" /></li>
                            </ul>                            
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="chart-placeholder">
                            <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="var(--accent-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M50 90 L50 20" />
                                <path d="M30 90 L70 90" />
                                <path d="M10 40 L50 20 L90 30" stroke="var(--accent-primary)" strokeWidth="3"/>
                                <path d="M10 40 L10 65" />
                                <path d="M0 65 A15 8 0 0 0 20 65" fill="rgba(99, 102, 241, 0.2)" />
                                <path d="M90 30 L90 45" />
                                <path d="M80 45 A15 8 0 0 0 100 45" fill="rgba(168, 85, 247, 0.2)" />
                                <path d="M45 15 L55 25 M55 15 L45 25" stroke="var(--accent-tertiary)" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
