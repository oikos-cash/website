import { useState } from 'react';
import { useKanban, API_BASE } from '../../context/KanbanContext';
import Column from './Column';
import CardModal from './CardModal';

export default function Board() {
  const { currentBoard, canEdit, createColumn, reorderColumns, setCurrentBoard } = useKanban();
  const [newColumnName, setNewColumnName] = useState('');
  const [addingColumn, setAddingColumn] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [draggedColumn, setDraggedColumn] = useState(null);

  if (!currentBoard) {
    return (
      <div className="kanban-no-board">
        <p>Select a board from the sidebar to get started</p>
      </div>
    );
  }

  const handleAddColumn = async (e) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;

    try {
      await createColumn(currentBoard.id, newColumnName.trim());
      setNewColumnName('');
      setAddingColumn(false);
    } catch (err) {
      console.error('Failed to create column:', err);
    }
  };

  const handleColumnDragStart = (e, columnId) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleColumnDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleColumnDrop = async (e, targetColumnId) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) {
      setDraggedColumn(null);
      return;
    }

    const columns = [...currentBoard.columns];
    const draggedIndex = columns.findIndex((c) => c.id === draggedColumn);
    const targetIndex = columns.findIndex((c) => c.id === targetColumnId);

    const [removed] = columns.splice(draggedIndex, 1);
    columns.splice(targetIndex, 0, removed);

    // Update local state immediately
    setCurrentBoard((prev) => ({ ...prev, columns }));

    // Persist to server
    try {
      await reorderColumns(
        currentBoard.id,
        columns.map((c) => c.id)
      );
    } catch (err) {
      console.error('Failed to reorder columns:', err);
    }

    setDraggedColumn(null);
  };

  const handleCardClick = (card, columnId) => {
    setSelectedCard({ ...card, columnId });
  };

  return (
    <div className="kanban-board">
      <div className="kanban-board-header">
        <div className="kanban-board-header-title">
          {currentBoard.logo && (
            <img
              src={`${API_BASE}/uploads/${currentBoard.logo}`}
              alt=""
              className="kanban-board-header-logo"
            />
          )}
          <h2>{currentBoard.name}</h2>
          {currentBoard.is_private ? <span className="kanban-board-private-badge">🔒 Private</span> : null}
        </div>
        {currentBoard.description && <p>{currentBoard.description}</p>}
      </div>

      <div className="kanban-columns-container">
        {currentBoard.columns?.map((column) => (
          <div
            key={column.id}
            draggable={canEdit}
            onDragStart={(e) => handleColumnDragStart(e, column.id)}
            onDragOver={handleColumnDragOver}
            onDrop={(e) => handleColumnDrop(e, column.id)}
            className={`kanban-column-wrapper ${draggedColumn === column.id ? 'dragging' : ''}`}
          >
            <Column column={column} onCardClick={handleCardClick} />
          </div>
        ))}

        {canEdit && (
          <div className="kanban-add-column">
            {addingColumn ? (
              <form onSubmit={handleAddColumn} className="kanban-add-column-form">
                <input
                  type="text"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Column name"
                  autoFocus
                />
                <div className="kanban-add-column-actions">
                  <button type="submit" className="kanban-btn-primary">
                    Add
                  </button>
                  <button
                    type="button"
                    className="kanban-btn-secondary"
                    onClick={() => {
                      setAddingColumn(false);
                      setNewColumnName('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button className="kanban-add-column-btn" onClick={() => setAddingColumn(true)}>
                + Add Column
              </button>
            )}
          </div>
        )}
      </div>

      {selectedCard && (
        <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
}
