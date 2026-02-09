import { Router } from 'express';
import db from '../db/database.js';
import { authenticate, canEdit } from '../middleware/auth.js';

const router = Router();

// Create column
router.post('/boards/:boardId/columns', authenticate, canEdit, (req, res) => {
  const { boardId } = req.params;
  const { name } = req.body;

  const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(boardId);

  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Column name is required' });
  }

  // Get max position
  const maxPos = db.prepare('SELECT MAX(position) as max FROM columns WHERE board_id = ?').get(boardId);
  const position = (maxPos.max ?? -1) + 1;

  const result = db.prepare('INSERT INTO columns (board_id, name, position) VALUES (?, ?, ?)').run(
    boardId,
    name.trim(),
    position
  );

  const column = db.prepare('SELECT * FROM columns WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json({ ...column, cards: [] });
});

// Update column
router.put('/:id', authenticate, canEdit, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const column = db.prepare('SELECT * FROM columns WHERE id = ?').get(id);

  if (!column) {
    return res.status(404).json({ error: 'Column not found' });
  }

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Column name is required' });
  }

  db.prepare('UPDATE columns SET name = ? WHERE id = ?').run(name.trim(), id);

  const updatedColumn = db.prepare('SELECT * FROM columns WHERE id = ?').get(id);

  res.json(updatedColumn);
});

// Delete column
router.delete('/:id', authenticate, canEdit, (req, res) => {
  const { id } = req.params;

  const column = db.prepare('SELECT * FROM columns WHERE id = ?').get(id);

  if (!column) {
    return res.status(404).json({ error: 'Column not found' });
  }

  // Delete column (cards will be deleted due to CASCADE)
  db.prepare('DELETE FROM columns WHERE id = ?').run(id);

  // Reorder remaining columns
  const columns = db.prepare('SELECT id FROM columns WHERE board_id = ? ORDER BY position').all(
    column.board_id
  );

  columns.forEach((col, index) => {
    db.prepare('UPDATE columns SET position = ? WHERE id = ?').run(index, col.id);
  });

  res.json({ message: 'Column deleted successfully' });
});

// Reorder columns
router.put('/reorder', authenticate, canEdit, (req, res) => {
  const { boardId, columnIds } = req.body;

  if (!boardId || !Array.isArray(columnIds)) {
    return res.status(400).json({ error: 'Board ID and column IDs array required' });
  }

  const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(boardId);

  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }

  // Update positions
  const updateStmt = db.prepare('UPDATE columns SET position = ? WHERE id = ? AND board_id = ?');

  columnIds.forEach((colId, index) => {
    updateStmt.run(index, colId, boardId);
  });

  res.json({ message: 'Columns reordered successfully' });
});

export default router;
