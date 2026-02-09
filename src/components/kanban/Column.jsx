import { useState } from 'react';
import { useKanban } from '../../context/KanbanContext';
import Card from './Card';

export default function Column({ column, onCardClick }) {
  const { canEdit, updateColumn, deleteColumn, createCard, moveCard, setCurrentBoard, currentBoard } =
    useKanban();
  const [editing, setEditing] = useState(false);
  const [columnName, setColumnName] = useState(column.name);
  const [addingCard, setAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [draggingCardId, setDraggingCardId] = useState(null);

  const handleUpdateName = async () => {
    if (!columnName.trim() || columnName === column.name) {
      setColumnName(column.name);
      setEditing(false);
      return;
    }

    try {
      await updateColumn(column.id, columnName.trim());
      setEditing(false);
    } catch (err) {
      console.error('Failed to update column:', err);
      setColumnName(column.name);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this column and all its cards?')) return;

    try {
      await deleteColumn(column.id);
    } catch (err) {
      console.error('Failed to delete column:', err);
    }
    setShowMenu(false);
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    try {
      await createCard(column.id, newCardTitle.trim());
      setNewCardTitle('');
      setAddingCard(false);
    } catch (err) {
      console.error('Failed to create card:', err);
    }
  };

  const handleCardDragStart = (e, card) => {
    e.dataTransfer.setData('cardId', card.id.toString());
    e.dataTransfer.setData('sourceColumnId', column.id.toString());
    e.dataTransfer.effectAllowed = 'move';
    setDraggingCardId(card.id);
  };

  const handleCardDragEnd = () => {
    setDraggingCardId(null);
  };

  const handleCardDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleCardDrop = async (e, targetPosition) => {
    e.preventDefault();
    e.stopPropagation();

    const cardId = parseInt(e.dataTransfer.getData('cardId'));
    const sourceColumnId = parseInt(e.dataTransfer.getData('sourceColumnId'));

    if (!cardId) return;

    // Find the source card
    let sourceCard = null;
    let sourceColumnIndex = -1;
    for (let i = 0; i < currentBoard.columns.length; i++) {
      const card = currentBoard.columns[i].cards.find((c) => c.id === cardId);
      if (card) {
        sourceCard = card;
        sourceColumnIndex = i;
        break;
      }
    }

    if (!sourceCard) return;

    // Calculate target position
    let newPosition = targetPosition;
    if (newPosition === undefined) {
      newPosition = column.cards.length;
    }

    // Optimistic update
    const newColumns = [...currentBoard.columns];

    // Remove from source column
    newColumns[sourceColumnIndex] = {
      ...newColumns[sourceColumnIndex],
      cards: newColumns[sourceColumnIndex].cards.filter((c) => c.id !== cardId),
    };

    // Add to target column
    const targetColumnIndex = newColumns.findIndex((c) => c.id === column.id);
    const targetCards = [...newColumns[targetColumnIndex].cards];
    targetCards.splice(newPosition, 0, { ...sourceCard, column_id: column.id });

    // Update positions
    targetCards.forEach((card, index) => {
      card.position = index;
    });

    newColumns[targetColumnIndex] = {
      ...newColumns[targetColumnIndex],
      cards: targetCards,
    };

    setCurrentBoard((prev) => ({ ...prev, columns: newColumns }));

    // Persist to server
    try {
      await moveCard(cardId, column.id, newPosition);
    } catch (err) {
      console.error('Failed to move card:', err);
    }
  };

  return (
    <div
      className="kanban-column"
      onDragOver={handleCardDragOver}
      onDrop={(e) => handleCardDrop(e, column.cards?.length || 0)}
    >
      <div className="kanban-column-header">
        {editing ? (
          <input
            type="text"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            onBlur={handleUpdateName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUpdateName();
              if (e.key === 'Escape') {
                setColumnName(column.name);
                setEditing(false);
              }
            }}
            autoFocus
            className="kanban-column-title-input"
          />
        ) : (
          <h3
            className="kanban-column-title"
            onClick={() => canEdit && setEditing(true)}
            title={canEdit ? 'Click to edit' : ''}
          >
            {column.name}
            <span className="kanban-column-count">{column.cards?.length || 0}</span>
          </h3>
        )}

        {canEdit && (
          <div className="kanban-column-menu-container">
            <button
              className="kanban-column-menu-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              ⋮
            </button>
            {showMenu && (
              <div className="kanban-column-menu">
                <button onClick={() => { setEditing(true); setShowMenu(false); }}>
                  Rename
                </button>
                <button onClick={handleDelete} className="danger">
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="kanban-cards-container">
        {column.cards?.map((card, index) => (
          <div
            key={card.id}
            className={`kanban-card-wrapper ${draggingCardId === card.id ? 'dragging' : ''}`}
            draggable={canEdit}
            onDragStart={(e) => handleCardDragStart(e, card)}
            onDragEnd={handleCardDragEnd}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => handleCardDrop(e, index)}
          >
            <Card card={card} onClick={() => onCardClick(card, column.id)} />
          </div>
        ))}
      </div>

      {canEdit && (
        <div className="kanban-add-card">
          {addingCard ? (
            <form onSubmit={handleAddCard} className="kanban-add-card-form">
              <textarea
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                placeholder="Enter card title..."
                autoFocus
                rows={2}
              />
              <div className="kanban-add-card-actions">
                <button type="submit" className="kanban-btn-primary">
                  Add Card
                </button>
                <button
                  type="button"
                  className="kanban-btn-secondary"
                  onClick={() => {
                    setAddingCard(false);
                    setNewCardTitle('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button className="kanban-add-card-btn" onClick={() => setAddingCard(true)}>
              + Add Card
            </button>
          )}
        </div>
      )}
    </div>
  );
}
