import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function EditModeToggle() {
    const { editMode, setEditMode, saveContent, hasUnsavedChanges } = useLanguage();
    const [position, setPosition] = useState({ x: 32, y: 32 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;

            const newX = e.clientX - offsetRef.current.x;
            const newY = e.clientY - offsetRef.current.y;

            // Keep within viewport bounds
            const maxX = window.innerWidth - (dragRef.current?.offsetWidth || 150);
            const maxY = window.innerHeight - (dragRef.current?.offsetHeight || 50);

            setPosition({
                x: Math.max(0, Math.min(newX, maxX)),
                y: Math.max(0, Math.min(newY, maxY))
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleMouseDown = (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;

        offsetRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
        setIsDragging(true);
    };

    const handleSave = () => {
        saveContent();
    };

    return (
        <div
            ref={dragRef}
            className={`edit-mode-toggle ${isDragging ? 'dragging' : ''}`}
            style={{
                left: position.x,
                top: position.y,
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
        >
            <label className="toggle-switch">
                <input
                    type="checkbox"
                    checked={editMode}
                    onChange={(e) => setEditMode(e.target.checked)}
                />
                <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">Edit</span>
            {editMode && (
                <button
                    className={`save-btn ${hasUnsavedChanges ? 'has-changes' : ''}`}
                    onClick={handleSave}
                    title={hasUnsavedChanges ? 'Save changes' : 'No changes to save'}
                >
                    Save
                </button>
            )}
        </div>
    );
}
