import EditableText from '../EditableText';

export default function MarketSlide({ isActive }) {
    return (
        <div className={`slide ${isActive ? 'active' : ''}`}>
            <div className="content-wrapper">
                <EditableText textKey="market_eyebrow" as="h3" />
                <EditableText textKey="market_title" as="h2" />
                <EditableText textKey="market_text" as="p" style={{ fontSize: '0.9rem' }} />

                <div className="grid-2">
                    <div className="card">
                        <div className="highlight"><EditableText textKey="market_curve_title" as="span" /></div>
                        <EditableText textKey="market_curve_text" as="p" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }} />
                    </div>
                    <div className="card">
                        <div className="highlight"><EditableText textKey="market_revenue_title" as="span" /></div>
                        <EditableText textKey="market_revenue_text" as="p" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }} />
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                     <div className="highlight" style={{ marginBottom: '0.5rem' }}>
                        <EditableText textKey="market_stats_title" as="span" />
                     </div>
                     <EditableText textKey="market_stats_text" as="p" style={{ margin: 0, fontSize: '0.85rem' }} />
                </div>
            </div>
        </div>
    );
}
