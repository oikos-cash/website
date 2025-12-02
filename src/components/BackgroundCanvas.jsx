import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { initBackground, switchBackground, destroyBackground } from '../utils/backgroundEffects';

const BackgroundCanvas = forwardRef(({ opacity = 0.2 }, ref) => {
    const canvasRef = useRef(null);

    useImperativeHandle(ref, () => ({
        switchEffect: (type) => {
            if (canvasRef.current) {
                switchBackground(canvasRef.current, type);
            }
        }
    }));

    useEffect(() => {
        if (canvasRef.current) {
            initBackground(canvasRef.current);
        }

        return () => {
            destroyBackground();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="bgCanvas"
            style={{ opacity }}
        />
    );
});

BackgroundCanvas.displayName = 'BackgroundCanvas';

export default BackgroundCanvas;
