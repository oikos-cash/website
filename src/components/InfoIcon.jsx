import { useState } from 'react';
import { createPortal } from 'react-dom';
import selfRepayingGif from '../assets/self-repaying-low.gif';
import dividendsGif from '../assets/dividends.gif';

const gifs = {
    'self-repaying': {
        src: selfRepayingGif,
        alt: 'Self-Repaying Loans Explanation'
    },
    'dividends': {
        src: dividendsGif,
        alt: 'Dividends Explanation'
    }
};

export default function InfoIcon({ type = 'self-repaying' }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = (e) => {
        e.stopPropagation();
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const gif = gifs[type] || gifs['self-repaying'];

    return (
        <>
            <span
                className="info-icon"
                onClick={handleOpen}
                title="Click to learn more"
            >
                ?
            </span>
            {isOpen && createPortal(
                <div className="info-overlay" onClick={handleClose}>
                    <div className="info-overlay-content" onClick={(e) => e.stopPropagation()}>
                        <button className="info-overlay-close" onClick={handleClose}>
                            ×
                        </button>
                        <img
                            src={gif.src}
                            alt={gif.alt}
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
