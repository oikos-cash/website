import { useLanguage } from '../../context/LanguageContext';
import EditableText from '../EditableText';

export default function ProblemHoldersSlide({ isActive }) {
    const { t } = useLanguage();

    return (
        <div className={`slide ${isActive ? 'active' : ''}`}>
            <div className="content-wrapper">
                <EditableText textKey="problem_holders_eyebrow" as="h3" />
                <EditableText textKey="problem_holders_title" as="h2" />
                <div className="grid-2">
                    <div style={{ order: 2 }}>
                        <EditableText textKey="problem_holders_text" as="p" />
                        <div style={{marginTop:"20px"}}>
                            <ul>
                                <li><EditableText textKey="problem_holders_list_1_title" as="strong" /> <EditableText textKey="problem_holders_list_1_text" as="span" /></li>
                                <li><EditableText textKey="problem_holders_list_2_title" as="strong" /> <EditableText textKey="problem_holders_list_2_text" as="span" /></li>
                                <li><EditableText textKey="problem_holders_list_3_title" as="strong" /> <EditableText textKey="problem_holders_list_3_text" as="span" /></li>
                            </ul>                            
                        </div>
                    </div>
                    <div style={{ order: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="chart-placeholder">
                            <svg width="150" height="100" viewBox="0 0 150 100" fill="none" stroke="var(--accent-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 10 L10 90 L140 90" stroke="var(--border-color)" />
                                <path d="M10 20 C40 20, 60 70, 130 80" stroke="#ef4444" strokeWidth="3" fill="none" />
                                <g transform="translate(100, 10)">
                                    <path d="M15 5 L28 30 L2 30 Z" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" />
                                    <path d="M15 12 L15 20" stroke="#ef4444" strokeWidth="2" />
                                    <circle cx="15" cy="24" r="1" fill="#ef4444" stroke="none" />
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
