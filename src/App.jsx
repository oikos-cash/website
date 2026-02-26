import { useState, useRef, useEffect, useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import BackgroundCanvas from './components/BackgroundCanvas';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSlide from './components/slides/HeroSlide';
import MissionSlide from './components/slides/MissionSlide';
import MarketSlide from './components/slides/MarketSlide';
import ProblemFoundersSlide from './components/slides/ProblemFoundersSlide';
import ProblemHoldersSlide from './components/slides/ProblemHoldersSlide';
import SolutionSlide from './components/slides/SolutionSlide';
import TechSlide from './components/slides/TechSlide';
import FeaturesSlide from './components/slides/FeaturesSlide';
import CreatorsSlide from './components/slides/CreatorsSlide';
import LaunchpadSlide from './components/slides/LaunchpadSlide';
import BusinessSlide from './components/slides/BusinessSlide';
import NomaTokenSlide from './components/slides/NomaTokenSlide';
import HoldersSlide from './components/slides/HoldersSlide';
import TeamSlide from './components/slides/TeamSlide';
import RoadmapSlide from './components/slides/RoadmapSlide';
import ContactSlide from './components/slides/ContactSlide';
import './App.css';

const slides = [
    HeroSlide,
    MissionSlide,
    MarketSlide,
    ProblemFoundersSlide,
    ProblemHoldersSlide,
    SolutionSlide,
    TechSlide,
    FeaturesSlide,
    CreatorsSlide,
    LaunchpadSlide,
    HoldersSlide,
    BusinessSlide,
    NomaTokenSlide,
    TeamSlide,
    RoadmapSlide,
    ContactSlide,
];

const ScrollObserverWrapper = ({ children, index, setVisible }) => {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(index, true);
                } else {
                    // Optional: set false if you want them to fade out when out of view
                    // setVisible(index, false);
                }
            },
            { threshold: 0.15 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [index, setVisible]);

    return (
        <div ref={ref} style={{ minHeight: '100vh' }}>
            {children}
        </div>
    );
};

function PitchDeck() {
    const { t } = useLanguage();
    const [bgOpacity, setBgOpacity] = useState(0.2);
    const [visibleSlides, setVisibleSlides] = useState({});
    const [scrollProgress, setScrollProgress] = useState(0);
    const bgCanvasRef = useRef(null);

    const handleSwitchBg = (type) => {
        if (bgCanvasRef.current) {
            bgCanvasRef.current.switchEffect(type);
        }
    };

    const handleOpacityChange = (value) => {
        setBgOpacity(value);
    };

    const handleVisibility = useCallback((index, isVisible) => {
        setVisibleSlides(prev => {
            // Only update if value changes to avoid unnecessary re-renders
            if (prev[index] === isVisible) return prev;
            return { ...prev, [index]: isVisible };
        });
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
            setScrollProgress(scroll);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <BackgroundCanvas ref={bgCanvasRef} opacity={bgOpacity} />
            <Header />

            <div className="progress" style={{ width: `${scrollProgress}%` }} />

            <div className="slides-container">
                {slides.map((SlideComponent, index) => (
                    <ScrollObserverWrapper 
                        key={index} 
                        index={index} 
                        setVisible={handleVisibility}
                    >
                        <SlideComponent isActive={!!visibleSlides[index]} />
                    </ScrollObserverWrapper>
                ))}
            </div>

            <Footer />

            {/* Mobile indicator - shows device type */}
            {isMobile && (
                <div style={{
                    position: 'fixed',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.7rem',
                    color: '#4b5563',
                    opacity: 0.5,
                    pointerEvents: 'none'
                }}>
                    Mobile View
                </div>
            )}
        </>
    );
}

function App() {
    return (
        <LanguageProvider>
            <PitchDeck />
        </LanguageProvider>
    );
}

export default App;
