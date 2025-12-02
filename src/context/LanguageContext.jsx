import { createContext, useContext, useState, useCallback } from 'react';

const translations = {
    en: {
        hero_tag: "Live on Binance Smart Chain",
        hero_title: "Oikos Protocol",
        hero_subtitle: "The Unruggable Liquidity Layer",
        hero_fairness_title: "Unruggable",
        hero_fairness_desc: "Liquidity managed by protocol",
        hero_liquidity_title: "Automated",
        hero_liquidity_desc: "Permission-less market making",

        mission_eyebrow: "Overview",
        mission_title: "The Next Gen Launchpad",
        mission_text: "Oikos evolves beyond simple token factories. It combines concentrated liquidity AMMs with 'unruggable' mechanics to create a turn-key solution for sustainable, trust-less token economies.",
        mission_card_founders_title: "Turn-key Solution",
        mission_card_founders_text: "Bootstrap entirely trust-less and decentralized tokens with customizable liquidity and elastic supply.",
        mission_card_holders_title: "New Asset Class",
        mission_card_holders_text: "Tokens with advanced DeFi functionalities like self-repaying loans and native leverage.",

        market_eyebrow: "Market Analysis",
        market_title: "The Launchpad Industry",
        market_text: "The sector has evolved from VC-dominated IDOs to permissionless platforms like pump.fun. Pump.fun leads Solana with ~$715M revenue and 70–95% market share.",
        market_curve_title: "The Bonding Curve",
        market_curve_text: "A deterministic price function where early buyers pay less. Oikos's 'shift' is equivalent to 'graduation', marking the transition from bootstrapping to a mature, liquid market.",
        market_revenue_title: "Creator Revenue Sharing",
        market_revenue_text: "Since May 2025, Pump.fun shares revenue. Post-graduation, creators receive 50% of the platform's share (0.025% of total volume).",
        market_stats_title: "Market Dominance",
        market_stats_text: "Pump.fun captures >$35M monthly revenue, validating the demand for fair, permissionless launch mechanisms.",

        problem_founders_eyebrow: "The Challenge",
        problem_founders_title: "The Utility Gap",
        problem_founders_text: "Current launchpads produce 'memecoins' that are purely speculative. They lack the DeFi maturity to support genuine economic activity.",
        problem_founders_list_1_title: "Rug Risks:",
        problem_founders_list_1_text: "Liquidity is often pulled or dumped on retail buyers.",
        problem_founders_list_2_title: "PVP Dynamics:",
        problem_founders_list_2_text: "Zero-sum games where sustainability is sacrificed for short-term pumps.",
        problem_founders_list_3_title: "Zero Utility:",
        problem_founders_list_3_text: "Tokens are idle assets. You can't borrow against them or earn yield.",

        problem_holders_eyebrow: "The Need",
        problem_holders_title: "A Better Way",
        problem_holders_text: "Investors need protection from PVP dynamics, while creators need sustainable revenue models beyond the initial pump.",
        problem_holders_list_1_title: "Unruggable:",
        problem_holders_list_1_text: "Liquidity should be managed by code, not people.",
        problem_holders_list_2_title: "Guaranteed Liquidity:",
        problem_holders_list_2_text: "Ability to sell back tokens at any time.",
        problem_holders_list_3_title: "Native Utility:",
        problem_holders_list_3_text: "Yield and borrowing capabilities built-in.",

        solution_eyebrow: "The Solution",
        solution_title: "Inherently Unruggable",
        solution_text: "Liquidity is entirely managed by the protocol, not the creator. Encoded rules forbid minting out of thin air; every supply change is a calculated market-making operation.",
        solution_card_1_title: "Protocol Managed",
        solution_card_1_text: "Creators cannot withdraw liquidity. It belongs to the protocol, guaranteeing the capacity to buy back 100% of circulating supply.",
        solution_card_2_title: "Only-Up Floor",
        solution_card_2_text: "Profits from volatility and fees are funneled into the floor, ensuring the minimum price mathematically only increases.",
        solution_card_3_title: "Elastic Supply",
        solution_card_3_text: "Supply expands with demand and contracts with selling, maintaining a strict 1:1 backing for every circulating token.",
        solution_card_4_title: "Revenue Engine",
        solution_card_4_text: "The protocol actively trades volatility (Shift/Slide), capturing spreads to deepen liquidity and reward participants.",

        tech_eyebrow: "Deep Dive",
        tech_title: "Permission-less Market Making",
        tech_text: "The system revolves around three contiguous concentrated liquidity positions: floor, anchor, and discovery.",
        tech_item_1_date: "SHIFT",
        tech_item_1_text: "Buying depletes 'discovery', triggering a <strong>Shift</strong>: liquidity re-balances upwards.",
        tech_item_2_date: "SLIDE",
        tech_item_2_text: "Selling absorbs tokens, triggering a <strong>Slide</strong>: supply reduces by burning un-backed tokens.",
        tech_item_3_date: "CONTROL",
        tech_item_3_text: "Liquidity is owned by the <strong>protocol</strong>. Circulating supply backed 1:1 at floor.",

        features_eyebrow: "Key Concepts",
        features_title: "Powerful Mechanisms",
        features_list_1_title: "Protocol Defined Supply",
        features_list_1_text: "Circulating supply must be backed 1:1 with real liquidity at the floor price.",
        features_list_2_title: "Solvency Invariant",
        features_list_2_text: "Capacity > Circulating Supply. Protocol can always buy back supply.",
        features_list_3_title: "Elastic Supply",
        features_list_3_text: "Supply expands and contracts based on market activity (Shift/Slide).",
        features_list_4_title: "Only Up Floor",
        features_list_4_text: "Floor price mathematically guaranteed to only increase.",

        launchpad_eyebrow: "User Experience",
        launchpad_title: "The Launchpad",
        launchpad_text: "A simple, friendly wizard guides users through the token creation process. No coding required.",
        launchpad_card_1_title: "No-Code Wizard",
        launchpad_card_1_text: "Define name, supply, and curves in minutes.",
        launchpad_card_2_title: "Instant Markets",
        launchpad_card_2_text: "Tokens are immediately tradable upon creation.",
        launchpad_ai_title: "AI Assistant",
        launchpad_ai_text: "Integrated AI helps generate token ideas and colorful logos instantly.",

        noma_token_eyebrow: "The Protocol Token",
        noma_token_title: "$OKS Utility",
        noma_token_text: "Holding $OKS gives access to the success of the entire ecosystem.",
        noma_token_card_1_title: "Protocol Dividends",
        noma_token_card_1_text: "A share of protocol profits is distributed to holders.",
        noma_token_card_2_title: "Ecosystem Index",
        noma_token_card_2_text: "Passively build exposure to every successful project.",
        noma_token_mechanism_title: "Vesting Stream",
        noma_token_mechanism_text: "Dividends are escrowed and released linearly over 180 days to align long-term incentives.",

        business_eyebrow: "Sustainability",
        business_title: "Economic Flywheel",
        business_card_1_stat: "Trading Fees",
        business_card_1_label: "AMM Volume",
        business_card_1_text: "Standard LP fees from the underlying Uniswap V3 positions.",
        business_card_2_stat: "Rebalancing",
        business_card_2_label: "Liquidity Shift",
        business_card_2_text: "Protocol captures value from volatility during Shift/Slide operations.",
        business_quote: "\"A self-sustaining engine that turns volatility into liquidity depth.\"",

        creators_eyebrow: "For Creators",
        creators_title: "Creator Economy",
        creators_text: "Unlike one-off fees, creators earn recurring revenue (~1% of inflation) at every upward Shift operation.",
        creators_card_title: "Launchpad Wizard",
        creators_card_text: "Simple setup: Token name, floor price, initial supply, and pre-sale settings.",
        creators_graphic_label: "Creator Fees",
        creators_footer_title: "AI Assistant",
        creators_footer_text: "Generates ideas and logos.",

        holders_eyebrow: "For Holders",
        holders_title: "Credit & Staking",
        holders_text: "Borrow against your tokens without liquidation risk. Stake to earn rewards.",
        holders_card_title: "Native Leverage",
        holders_card_text: "Use borrowed funds to buy more tokens ('Looping') to increase exposure.",
        holders_list_1_title: "No Liquidation:",
        holders_list_1_text: "Floor price only increases, securing your collateral.",
        holders_list_2_title: "Self-Repaying:",
        holders_list_2_text: "Loans > 2.5 LTV are paid back by protocol profits.",
        holders_graphic_title: "Staking",
        holders_graphic_sub: "AUTO-COMPOUNDING",
        holders_graphic_footer_title: "No Claiming Needed",
        holders_graphic_footer_text: "Unstake to get original + rewards.",

        roadmap_eyebrow: "The Future",
        roadmap_title: "Roadmap & Directions",
        roadmap_item_1_date: "NOW",
        roadmap_item_1_title: "Binance Smart Chain Mainnet",
        roadmap_item_1_text: "Protocol release. Finding product market fit.",
        roadmap_item_2_date: "SOON",
        roadmap_item_2_title: "AI Integration",
        roadmap_item_2_text: "Coupling AI with protocol parameters & Uniswap V4 hooks.",
        roadmap_item_3_date: "LATER",
        roadmap_item_3_title: "Protocol DAO",
        roadmap_item_3_text: "Formalizing governance for resilience.",
        roadmap_item_4_date: "GOAL",
        roadmap_item_4_title: "Evolution",
        roadmap_item_4_text: "Continuous improvement based on community feedback.",

        contact_eyebrow: "Get in Touch",
        contact_title: "Join Oikos",
        contact_text: "We are building the future of fair launches.",
        contact_btn: "Launch App",
        contact_twitter_label: "@oikos_cash",
        contact_discord_label: "discord.gg/oikoscash",
        contact_web_label: "https://oikos.cash",

        controls_prev: "Previous",
        controls_next: "Next",
        controls_bg_title: "Background FX",
        controls_bg_intensity: "Intensity",
    },
    es: {
        hero_tag: "En vivo en Binance Smart Chain Mainnet",
        hero_title: "Protocolo Oikos",
        hero_subtitle: "La Capa de Liquidez Indestructible",
        hero_fairness_title: "Indestructible",
        hero_fairness_desc: "Liquidez gestionada por protocolo",
        hero_liquidity_title: "Automatizado",
        hero_liquidity_desc: "Creación de mercado sin permisos",

        mission_eyebrow: "Descripción General",
        mission_title: "Launchpad de Próxima Generación",
        mission_text: "Oikos evoluciona más allá de simples fábricas de tokens. Combina AMMs de liquidez concentrada con mecánica 'indestructible' para crear soluciones llave en mano para economías de tokens sostenibles.",
        mission_card_founders_title: "Solución Llave en Mano",
        mission_card_founders_text: "Lanza tokens totalmente descentralizados y sin confianza con liquidez personalizable y oferta elástica.",
        mission_card_holders_title: "Nueva Clase de Activo",
        mission_card_holders_text: "Tokens con funcionalidades DeFi avanzadas como préstamos auto-pagables y apalancamiento nativo.",

        market_eyebrow: "Análisis de Mercado",
        market_title: "La Industria de Launchpad",
        market_text: "El sector ha evolucionado de IDOs dominados por VC a plataformas sin permiso como pump.fun. Pump.fun lidera Solana con ~$715M en ingresos y 70-95% de cuota de mercado.",
        market_curve_title: "La Curva de Vinculación",
        market_curve_text: "Función de precio determinista donde los primeros compradores pagan menos. El 'shift' de Oikos equivale a la 'graduación', marcando la transición de bootstrapping a un mercado líquido y maduro.",
        market_revenue_title: "Ingresos para Creadores",
        market_revenue_text: "Desde mayo de 2025, Pump.fun comparte ingresos. Post-graduación, los creadores reciben el 50% de la cuota de la plataforma (0.025% del volumen total).",
        market_stats_title: "Dominio del Mercado",
        market_stats_text: "Pump.fun captura >$35M en ingresos mensuales, validando la demanda de mecanismos de lanzamiento justos.",

        problem_founders_eyebrow: "El Desafío",
        problem_founders_title: "La Brecha de Utilidad",
        problem_founders_text: "Los launchpads actuales producen 'memecoins' puramente especulativas. Carecen de la madurez DeFi para soportar actividad económica real.",
        problem_founders_list_1_title: "Riesgos de Rug:",
        problem_founders_list_1_text: "La liquidez a menudo se retira o se vende a minoristas.",
        problem_founders_list_2_title: "Dinámicas PVP:",
        problem_founders_list_2_text: "Juegos de suma cero donde la sostenibilidad se sacrifica por pumps a corto plazo.",
        problem_founders_list_3_title: "Cero Utilidad:",
        problem_founders_list_3_text: "Activos ociosos. No puedes pedir prestado contra ellos ni generar rendimiento.",

        problem_holders_eyebrow: "La Necesidad",
        problem_holders_title: "Una Mejor Manera",
        problem_holders_text: "Los inversores necesitan protección contra la dinámica PVP, y los creadores necesitan modelos de ingresos sostenibles.",
        problem_holders_list_1_title: "Indestructible:",
        problem_holders_list_1_text: "La liquidez debe ser gestionada por código, no por personas.",
        problem_holders_list_2_title: "Liquidez Garantizada:",
        problem_holders_list_2_text: "Capacidad de vender tokens en cualquier momento.",
        problem_holders_list_3_title: "Utilidad Nativa:",
        problem_holders_list_3_text: "Rendimiento y capacidades de préstamo integradas.",

        solution_eyebrow: "La Solución",
        solution_title: "Inherentemente Indestructible",
        solution_text: "La liquidez es gestionada totalmente por el protocolo, no por el creador. Las reglas prohíben acuñar de la nada; cada cambio de oferta es una operación de mercado calculada.",
        solution_card_1_title: "Gestionado por Protocolo",
        solution_card_1_text: "Los creadores no pueden retirar liquidez. Pertenece al protocolo, garantizando la capacidad de recomprar el 100% de la oferta.",
        solution_card_2_title: "Piso Solo Sube",
        solution_card_2_text: "Las ganancias de volatilidad y tarifas se canalizan al piso, asegurando matemáticamente que el precio mínimo solo suba.",
        solution_card_3_title: "Oferta Elástica",
        solution_card_3_text: "La oferta se expande con la demanda y se contrae con la venta, manteniendo un respaldo estricto 1:1 para cada token.",
        solution_card_4_title: "Motor de Ingresos",
        solution_card_4_text: "El protocolo comercia activamente la volatilidad, capturando spreads para profundizar la liquidez y recompensar a participantes.",

        tech_eyebrow: "Profundización",
        tech_title: "Creación de Mercado Sin Permisos",
        tech_text: "El sistema gira en torno a tres posiciones de liquidez concentrada contiguas: piso, ancla y descubrimiento.",
        tech_item_1_date: "SHIFT",
        tech_item_1_text: "La compra agota 'descubrimiento', activando un <strong>Shift</strong>: la liquidez se reequilibra hacia arriba.",
        tech_item_2_date: "SLIDE",
        tech_item_2_text: "La venta absorbe tokens, activando un <strong>Slide</strong>: la oferta se reduce quemando tokens sin respaldo.",
        tech_item_3_date: "CONTROL",
        tech_item_3_text: "La liquidez es propiedad del <strong>protocolo</strong>. Oferta circulante respaldada 1:1 en el piso.",

        features_eyebrow: "Conceptos Clave",
        features_title: "Mecanismos Potentes",
        features_list_1_title: "Oferta Definida por Protocolo",
        features_list_1_text: "La oferta circulante debe estar respaldada 1:1 con liquidez real al precio base.",
        features_list_2_title: "Invariante de Solvencia",
        features_list_2_text: "Capacidad > Oferta Circulante. El protocolo siempre puede recomprar la oferta.",
        features_list_3_title: "Oferta Elástica",
        features_list_3_text: "La oferta se expande y contrae según la actividad del mercado (Shift/Slide).",
        features_list_4_title: "Precio Base Solo Sube",
        features_list_4_text: "Precio base matemáticamente garantizado para solo aumentar.",

        launchpad_eyebrow: "Experiencia de Usuario",
        launchpad_title: "El Launchpad",
        launchpad_text: "Un asistente simple y amigable guía a los usuarios a través del proceso de creación de tokens. No se requiere código.",
        launchpad_card_1_title: "Asistente Sin Código",
        launchpad_card_1_text: "Define nombre, oferta y curvas en minutos.",
        launchpad_card_2_title: "Mercados Instantáneos",
        launchpad_card_2_text: "Los tokens son inmediatamente negociables tras su creación.",
        launchpad_ai_title: "Asistente IA",
        launchpad_ai_text: "La IA integrada ayuda a generar ideas de tokens y logotipos coloridos al instante.",

        noma_token_eyebrow: "El Token del Protocolo",
        noma_token_title: "Utilidad de $OKS",
        noma_token_text: "Mantener $OKS da acceso al éxito de todo el ecosistema.",
        noma_token_card_1_title: "Dividendos del Protocolo",
        noma_token_card_1_text: "Una parte de las ganancias del protocolo se distribuye a los holders.",
        noma_token_card_2_title: "Índice del Ecosistema",
        noma_token_card_2_text: "Construye pasivamente exposición a cada proyecto exitoso.",
        noma_token_mechanism_title: "Flujo de Vesting",
        noma_token_mechanism_text: "Los dividendos se custodian y liberan linealmente durante 180 días para alinear incentivos a largo plazo.",

        business_eyebrow: "Sostenibilidad",
        business_title: "Volante Económico",
        business_card_1_stat: "Tarifas de Trading",
        business_card_1_label: "Volumen AMM",
        business_card_1_text: "Tarifas LP estándar de las posiciones subyacentes de Uniswap V3.",
        business_card_2_stat: "Reequilibrio",
        business_card_2_label: "Cambio de Liquidez",
        business_card_2_text: "El protocolo captura valor de la volatilidad durante operaciones Shift/Slide.",
        business_quote: "\"Un motor autosostenible que convierte la volatilidad en profundidad de liquidez.\"",

        creators_eyebrow: "Para Creadores",
        creators_title: "Economía de Creadores",
        creators_text: "A diferencia de las tarifas únicas, los creadores obtienen ingresos recurrentes (~1% de inflación) en cada operación Shift ascendente.",
        creators_card_title: "Asistente Launchpad",
        creators_card_text: "Configuración simple: Nombre del token, precio base, oferta inicial y ajustes de preventa.",
        creators_graphic_label: "Tarifas de Creador",
        creators_footer_title: "Asistente IA",
        creators_footer_text: "Genera ideas y logotipos.",

        holders_eyebrow: "Para Holders",
        holders_title: "Crédito y Staking",
        holders_text: "Pide prestado contra tus tokens sin riesgo de liquidación. Haz staking para ganar recompensas.",
        holders_card_title: "Apalancamiento Nativo",
        holders_card_text: "Usa fondos prestados para comprar más tokens ('Looping') para aumentar la exposición.",
        holders_list_1_title: "Sin Liquidación:",
        holders_list_1_text: "El precio base solo aumenta, asegurando tu colateral.",
        holders_list_2_title: "Auto-pagable:",
        holders_list_2_text: "Préstamos > 2.5 LTV son pagados por las ganancias del protocolo.",
        holders_graphic_title: "Staking",
        holders_graphic_sub: "AUTO-COMPOUNDING",
        holders_graphic_footer_title: "No Requiere Reclamo",
        holders_graphic_footer_text: "Deshaz el staking para obtener original + recompensas.",

        roadmap_eyebrow: "El Futuro",
        roadmap_title: "Hoja de Ruta y Direcciones",
        roadmap_item_1_date: "AHORA",
        roadmap_item_1_title: "Binance Smart Chain",
        roadmap_item_1_text: "Lanzamiento del protocolo. Buscando ajuste producto-mercado.",
        roadmap_item_2_date: "PRONTO",
        roadmap_item_2_title: "Integración IA",
        roadmap_item_2_text: "Acoplamiento de IA con parámetros de protocolo y hooks de Uniswap V4.",
        roadmap_item_3_date: "LUEGO",
        roadmap_item_3_title: "DAO del Protocolo",
        roadmap_item_3_text: "Formalizando la gobernanza para la resiliencia.",
        roadmap_item_4_date: "META",
        roadmap_item_4_title: "Evolución",
        roadmap_item_4_text: "Mejora continua basada en comentarios de la comunidad.",

        contact_eyebrow: "Ponte en Contacto",
        contact_title: "Únete a Oikos",
        contact_text: "Estamos construyendo el futuro de los lanzamientos justos.",
        contact_btn: "Lanzar App",
        contact_twitter_label: "@oikos_cash",
        contact_discord_label: "discord.gg/oikoscash",
        contact_web_label: "https://oikos.cash",

        controls_prev: "Anterior",
        controls_next: "Siguiente",
        controls_bg_title: "Efectos de Fondo",
        controls_bg_intensity: "Intensidad",
    }
};

const STORAGE_KEY = 'pitch-deck-content-overrides-v2';

const LanguageContext = createContext();

// Load saved content from localStorage
const loadSavedContent = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        console.error('Failed to load saved content:', e);
        return {};
    }
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');
    const [editMode, setEditMode] = useState(false);
    const [contentOverrides, setContentOverrides] = useState(loadSavedContent);
    const [savedContent, setSavedContent] = useState(loadSavedContent);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Track if there are unsaved changes
    const checkUnsavedChanges = useCallback(() => {
        const currentStr = JSON.stringify(contentOverrides);
        const savedStr = JSON.stringify(savedContent);
        setHasUnsavedChanges(currentStr !== savedStr);
    }, [contentOverrides, savedContent]);

    // Check for unsaved changes whenever contentOverrides changes
    useCallback(() => {
        checkUnsavedChanges();
    }, [contentOverrides, checkUnsavedChanges]);

    const updateContent = useCallback((key, value) => {
        setContentOverrides(prev => {
            const updated = {
                ...prev,
                [language]: {
                    ...prev[language],
                    [key]: value
                }
            };
            // Check if there are unsaved changes
            const savedStr = JSON.stringify(savedContent);
            const updatedStr = JSON.stringify(updated);
            setHasUnsavedChanges(savedStr !== updatedStr);
            return updated;
        });
    }, [language, savedContent]);

    const saveContent = useCallback(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(contentOverrides));
            setSavedContent(contentOverrides);
            setHasUnsavedChanges(false);
            console.log('Content saved successfully!');
        } catch (e) {
            console.error('Failed to save content:', e);
        }
    }, [contentOverrides]);

    const t = useCallback((key) => {
        // Check for content overrides first
        const override = contentOverrides[language]?.[key];
        if (override !== undefined) {
            return override;
        }
        return translations[language]?.[key] || translations.en[key] || key;
    }, [language, contentOverrides]);

    const tHtml = useCallback((key) => {
        const override = contentOverrides[language]?.[key];
        const text = override !== undefined ? override : (translations[language]?.[key] || translations.en[key] || key);
        return { __html: text };
    }, [language, contentOverrides]);

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage,
            t,
            tHtml,
            editMode,
            setEditMode,
            updateContent,
            saveContent,
            hasUnsavedChanges
        }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
