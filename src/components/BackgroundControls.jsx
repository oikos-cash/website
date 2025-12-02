import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { isMobile } from 'react-device-detect';

export default function BackgroundControls({ onSwitchBg, onOpacityChange }) {
    const { t } = useLanguage();
    const [collapsed, setCollapsed] = useState(isMobile);
    const [opacity, setOpacity] = useState(0.2);
    const [activeEffect, setActiveEffect] = useState(null);

    useEffect(() => {
        if (isMobile) {
            setCollapsed(true);
        }
    }, []);

    const handleSwitch = (type) => {
        setActiveEffect(type);
        onSwitchBg(type);
    };

    const handleOpacityChange = (e) => {
        const value = parseFloat(e.target.value);
        setOpacity(value);
        onOpacityChange(value);
    };

    const effects = [
        { id: 'attractor', label: 'Attractor' },
        { id: 'cosmic-quantum', label: 'Cosmic' },
        { id: 'neural-nexus', label: 'Neural' },
        { id: 'hyperspace', label: 'Hyperspace' },
        { id: 'flow-field', label: 'Flow Field' },
        { id: 'aurora-borealis', label: 'Aurora' },
        { id: 'cosmic-gas', label: 'Cosmic Gas' },
    ];

    return (
        <div className={`bg-controls ${collapsed ? 'collapsed' : ''}`}>
            <div className="bg-controls-header">
                <span>{t('controls_bg_title')}</span>
                <button
                    className="bg-toggle-btn"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? '+' : '–'}
                </button>
            </div>
            <div className="bg-controls-content">
                {effects.map((effect) => (
                    <button
                        key={effect.id}
                        className={`bg-btn ${activeEffect === effect.id ? 'active' : ''}`}
                        onClick={() => handleSwitch(effect.id)}
                        style={activeEffect === effect.id ? {
                            borderColor: 'var(--accent-primary)',
                            color: 'var(--accent-primary)'
                        } : {}}
                    >
                        {effect.label}
                    </button>
                ))}

                <div className="control-group">
                    <label className="control-label" htmlFor="bgOpacity">
                        {t('controls_bg_intensity')}
                    </label>
                    <input
                        type="range"
                        id="bgOpacity"
                        min="0"
                        max="1"
                        step="0.01"
                        value={opacity}
                        onChange={handleOpacityChange}
                    />
                </div>
            </div>
        </div>
    );
}
