import { useLanguage } from '../../context/LanguageContext';
import EditableText from '../EditableText';
import InfoIcon from '../InfoIcon';

export default function FeaturesSlide({ isActive }) {
    const { t } = useLanguage();

    return (
        <div className={`slide ${isActive ? 'active' : ''}`}>
            <div className="content-wrapper">
                <EditableText textKey="features_eyebrow" as="h3" />
                <EditableText textKey="features_title" as="h2" />
                <div className="grid-2">
                    <div>
                        <ul>
                            <li>
                                <strong style={{ color: 'white' }}><EditableText textKey="features_list_1_title" as="span" /></strong>
                                <br/><EditableText textKey="features_list_1_text" as="span" />
                            </li>
                            <li>
                                <strong style={{ color: 'white' }}>
                                    <EditableText textKey="features_list_2_title" as="span" />
                                    <InfoIcon type="self-repaying" />
                                </strong>
                                <br/><EditableText textKey="features_list_2_text" as="span" />
                            </li>
                        </ul>
                    </div>
                    <div>
                        <ul>
                            <li>
                                <strong style={{ color: 'white' }}>
                                    <EditableText textKey="features_list_3_title" as="span" />
                                </strong>
                                <br/><EditableText textKey="features_list_3_text" as="span" />
                            </li>
                            <li>
                                <strong style={{ color: 'white' }}><EditableText textKey="features_list_4_title" as="span" /></strong>
                                <br/><EditableText textKey="features_list_4_text" as="span" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
