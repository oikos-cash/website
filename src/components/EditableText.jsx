import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function EditableText({
    textKey,
    as: Component = 'span',
    className = '',
    style = {},
    html = false,
    children
}) {
    const { t, tHtml, editMode, updateContent } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');
    const textareaRef = useRef(null);

    const content = html ? t(textKey) : t(textKey);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
        }
    }, [isEditing]);

    const handleClick = (e) => {
        if (editMode && !isEditing) {
            e.stopPropagation();
            setEditValue(content);
            setIsEditing(true);
        }
    };

    const handleBlur = () => {
        if (editValue !== content) {
            updateContent(textKey, editValue);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsEditing(false);
        } else if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleBlur();
        }
    };

    if (isEditing) {
        return (
            <textarea
                ref={textareaRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="editable-textarea"
                style={{
                    ...style,
                    width: '100%',
                    minHeight: '60px',
                    resize: 'vertical'
                }}
            />
        );
    }

    const editableStyle = editMode ? {
        ...style,
        cursor: 'pointer',
        outline: '2px dashed rgba(99, 102, 241, 0.4)',
        outlineOffset: '4px',
        borderRadius: '4px',
        transition: 'outline-color 0.2s'
    } : style;

    if (html) {
        return (
            <Component
                className={`${className} ${editMode ? 'editable-text' : ''}`}
                style={editableStyle}
                onClick={handleClick}
                dangerouslySetInnerHTML={tHtml(textKey)}
            />
        );
    }

    return (
        <Component
            className={`${className} ${editMode ? 'editable-text' : ''}`}
            style={editableStyle}
            onClick={handleClick}
        >
            {children || content}
        </Component>
    );
}
