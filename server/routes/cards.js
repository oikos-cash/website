import { Router } from 'express';
import db from '../db/database.js';
import { authenticate, canEdit } from '../middleware/auth.js';

const router = Router();

// Create card
router.post('/columns/:columnId/cards', authenticate, canEdit, (req, res) => {
  const { columnId } = req.params;
  const { title, description, labels, due_date } = req.body;

  const column = db.prepare('SELECT * FROM columns WHERE id = ?').get(columnId);

  if (!column) {
    return res.status(404).json({ error: 'Column not found' });
  }

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Card title is required' });
  }

  // Get max position
  const maxPos = db.prepare('SELECT MAX(position) as max FROM cards WHERE column_id = ?').get(columnId);
  const position = (maxPos.max ?? -1) + 1;

  const labelsJson = labels ? JSON.stringify(labels) : null;

  const result = db.prepare(`
    INSERT INTO cards (column_id, title, description, labels, due_date, position)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(columnId, title.trim(), description || null, labelsJson, due_date || null, position);

  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(result.lastInsertRowid);

  // Parse labels for response
  if (card.labels) {
    try {
      card.labels = JSON.parse(card.labels);
    } catch {
      card.labels = [];
    }
  } else {
    card.labels = [];
  }

  res.status(201).json(card);
});

// Update card
router.put('/:id', authenticate, canEdit, (req, res) => {
  const { id } = req.params;
  const { title, description, labels, due_date } = req.body;

  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(id);

  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }

  if (title !== undefined && (!title || !title.trim())) {
    return res.status(400).json({ error: 'Card title cannot be empty' });
  }

  const updates = [];
  const values = [];

  if (title !== undefined) {
    updates.push('title = ?');
    values.push(title.trim());
  }

  if (description !== undefined) {
    updates.push('description = ?');
    values.push(description || null);
  }

  if (labels !== undefined) {
    updates.push('labels = ?');
    values.push(labels ? JSON.stringify(labels) : null);
  }

  if (due_date !== undefined) {
    updates.push('due_date = ?');
    values.push(due_date || null);
  }

  if (updates.length > 0) {
    values.push(id);
    db.prepare(`UPDATE cards SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  }

  const updatedCard = db.prepare('SELECT * FROM cards WHERE id = ?').get(id);

  // Parse labels for response
  if (updatedCard.labels) {
    try {
      updatedCard.labels = JSON.parse(updatedCard.labels);
    } catch {
      updatedCard.labels = [];
    }
  } else {
    updatedCard.labels = [];
  }

  res.json(updatedCard);
});

// Delete card
router.delete('/:id', authenticate, canEdit, (req, res) => {
  const { id } = req.params;

  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(id);

  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }

  db.prepare('DELETE FROM cards WHERE id = ?').run(id);

  // Reorder remaining cards in the column
  const cards = db.prepare('SELECT id FROM cards WHERE column_id = ? ORDER BY position').all(
    card.column_id
  );

  cards.forEach((c, index) => {
    db.prepare('UPDATE cards SET position = ? WHERE id = ?').run(index, c.id);
  });

  res.json({ message: 'Card deleted successfully' });
});

// Move card to different column or position
router.put('/:id/move', authenticate, canEdit, (req, res) => {
  const { id } = req.params;
  const { column_id, position } = req.body;

  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(id);

  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }

  if (column_id !== undefined) {
    const column = db.prepare('SELECT * FROM columns WHERE id = ?').get(column_id);
    if (!column) {
      return res.status(404).json({ error: 'Target column not found' });
    }
  }

  const targetColumnId = column_id ?? card.column_id;
  const oldColumnId = card.column_id;

  // Remove from old position
  db.prepare('UPDATE cards SET position = position - 1 WHERE column_id = ? AND position > ?').run(
    oldColumnId,
    card.position
  );

  // Insert at new position
  let newPosition = position;
  if (newPosition === undefined) {
    const maxPos = db.prepare('SELECT MAX(position) as max FROM cards WHERE column_id = ?').get(
      targetColumnId
    );
    newPosition = (maxPos.max ?? -1) + 1;
  } else {
    db.prepare('UPDATE cards SET position = position + 1 WHERE column_id = ? AND position >= ?').run(
      targetColumnId,
      newPosition
    );
  }

  db.prepare('UPDATE cards SET column_id = ?, position = ? WHERE id = ?').run(
    targetColumnId,
    newPosition,
    id
  );

  const updatedCard = db.prepare('SELECT * FROM cards WHERE id = ?').get(id);

  // Parse labels for response
  if (updatedCard.labels) {
    try {
      updatedCard.labels = JSON.parse(updatedCard.labels);
    } catch {
      updatedCard.labels = [];
    }
  } else {
    updatedCard.labels = [];
  }

  res.json(updatedCard);
});

// Reorder cards within a column
router.put('/reorder', authenticate, canEdit, (req, res) => {
  const { columnId, cardIds } = req.body;

  if (!columnId || !Array.isArray(cardIds)) {
    return res.status(400).json({ error: 'Column ID and card IDs array required' });
  }

  const column = db.prepare('SELECT * FROM columns WHERE id = ?').get(columnId);

  if (!column) {
    return res.status(404).json({ error: 'Column not found' });
  }

  // Update positions
  const updateStmt = db.prepare('UPDATE cards SET position = ? WHERE id = ? AND column_id = ?');

  cardIds.forEach((cardId, index) => {
    updateStmt.run(index, cardId, columnId);
  });

  res.json({ message: 'Cards reordered successfully' });
});

export default router;
