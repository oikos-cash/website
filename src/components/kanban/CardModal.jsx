import { useState, useEffect } from 'react';
import { useKanban } from '../../context/KanbanContext';

const LABEL_COLORS = [
  { name: 'Red', color: '#ef4444' },
  { name: 'Orange', color: '#f97316' },
  { name: 'Yellow', color: '#eab308' },
  { name: 'Green', color: '#22c55e' },
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Purple', color: '#a855f7' },
  { name: 'Pink', color: '#ec4899' },
  { name: 'Gray', color: '#6b7280' },
];

export default function CardModal({ card, onClose }) {
  const { canEdit, updateCard, deleteCard } = useKanban();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [labels, setLabels] = useState(card.labels || []);
  const [dueDate, setDueDate] = useState(card.due_date || '');
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);

    try {
      await updateCard(card.id, {
        title: title.trim(),
        description: description.trim() || null,
        labels: labels.length > 0 ? labels : null,
        due_date: dueDate || null,
      });
      onClose();
    } catch (err) {
      console.error('Failed to update card:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this card?')) return;

    try {
      await deleteCard(card.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete card:', err);
    }
  };

  const toggleLabel = (labelColor) => {
    const exists = labels.find((l) => l.color === labelColor.color);
    if (exists) {
      setLabels(labels.filter((l) => l.color !== labelColor.color));
    } else {
      setLabels([...labels, labelColor]);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="kanban-modal-backdrop" onClick={handleBackdropClick}>
      <div className="kanban-modal">
        <div className="kanban-modal-header">
          <h3>Card Details</h3>
          <button className="kanban-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="kanban-modal-body">
          <div className="kanban-modal-section">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!canEdit}
              className="kanban-modal-input"
            />
          </div>

          <div className="kanban-modal-section">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!canEdit}
              rows={4}
              placeholder="Add a description..."
              className="kanban-modal-textarea"
            />
          </div>

          <div className="kanban-modal-section">
            <label>Labels</label>
            <div className="kanban-modal-labels">
              {labels.map((label, index) => (
                <span
                  key={index}
                  className="kanban-modal-label"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                  {canEdit && (
                    <button
                      onClick={() => toggleLabel(label)}
                      className="kanban-modal-label-remove"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {canEdit && (
                <button
                  className="kanban-modal-add-label"
                  onClick={() => setShowLabelPicker(!showLabelPicker)}
                >
                  + Add Label
                </button>
              )}
            </div>
            {showLabelPicker && canEdit && (
              <div className="kanban-label-picker">
                {LABEL_COLORS.map((labelColor) => (
                  <button
                    key={labelColor.color}
                    className={`kanban-label-option ${
                      labels.find((l) => l.color === labelColor.color) ? 'selected' : ''
                    }`}
                    style={{ backgroundColor: labelColor.color }}
                    onClick={() => toggleLabel(labelColor)}
                  >
                    {labelColor.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="kanban-modal-section">
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={!canEdit}
              className="kanban-modal-input"
            />
          </div>
        </div>

        <div className="kanban-modal-footer">
          {canEdit && (
            <>
              <button className="kanban-btn-danger" onClick={handleDelete}>
                Delete
              </button>
              <div className="kanban-modal-footer-right">
                <button className="kanban-btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button
                  className="kanban-btn-primary"
                  onClick={handleSave}
                  disabled={saving || !title.trim()}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </>
          )}
          {!canEdit && (
            <button className="kanban-btn-secondary" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
