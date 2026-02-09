import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from '../db/database.js';
import { authenticate, canEdit, isAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Setup multer for logo uploads
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `board-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|svg|webp)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Helper: Check if user has access to a board
function hasAccess(userId, userRole, board) {
  // Admins can see all boards
  if (userRole === 'admin') return true;
  // Public boards are visible to all
  if (!board.is_private) return true;
  // Creator always has access
  if (board.created_by === userId) return true;
  // Check board_access table
  const access = db.prepare(
    'SELECT 1 FROM board_access WHERE board_id = ? AND user_id = ?'
  ).get(board.id, userId);
  return !!access;
}

// Get all boards (filtered by access)
router.get('/', authenticate, (req, res) => {
  let boards;

  if (req.user.role === 'admin') {
    // Admins see all boards
    boards = db.prepare(`
      SELECT b.*, u.username as created_by_username,
        (SELECT COUNT(*) FROM board_access WHERE board_id = b.id) as member_count
      FROM boards b
      LEFT JOIN users u ON b.created_by = u.id
      ORDER BY b.created_at DESC
    `).all();
  } else {
    // Others see public boards + boards they have access to
    boards = db.prepare(`
      SELECT b.*, u.username as created_by_username,
        (SELECT COUNT(*) FROM board_access WHERE board_id = b.id) as member_count
      FROM boards b
      LEFT JOIN users u ON b.created_by = u.id
      WHERE b.is_private = 0
        OR b.created_by = ?
        OR EXISTS (SELECT 1 FROM board_access ba WHERE ba.board_id = b.id AND ba.user_id = ?)
      ORDER BY b.created_at DESC
    `).all(req.user.id, req.user.id);
  }

  res.json(boards);
});

// Get single board with columns and cards
router.get('/:id', authenticate, (req, res) => {
  const { id } = req.params;

  const board = db.prepare(`
    SELECT b.*, u.username as created_by_username
    FROM boards b
    LEFT JOIN users u ON b.created_by = u.id
    WHERE b.id = ?
  `).get(id);

  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }

  // Check access
  if (!hasAccess(req.user.id, req.user.role, board)) {
    return res.status(403).json({ error: 'Access denied to this board' });
  }

  const columns = db.prepare(`
    SELECT * FROM columns WHERE board_id = ? ORDER BY position
  `).all(id);

  const columnIds = columns.map((c) => c.id);

  let cards = [];
  if (columnIds.length > 0) {
    const placeholders = columnIds.map(() => '?').join(',');
    cards = db.prepare(`
      SELECT * FROM cards WHERE column_id IN (${placeholders}) ORDER BY position
    `).all(...columnIds);
  }

  // Group cards by column
  const cardsByColumn = {};
  for (const card of cards) {
    if (!cardsByColumn[card.column_id]) {
      cardsByColumn[card.column_id] = [];
    }
    if (card.labels) {
      try {
        card.labels = JSON.parse(card.labels);
      } catch {
        card.labels = [];
      }
    } else {
      card.labels = [];
    }
    cardsByColumn[card.column_id].push(card);
  }

  const columnsWithCards = columns.map((col) => ({
    ...col,
    cards: cardsByColumn[col.id] || [],
  }));

  // Get board members
  const members = db.prepare(`
    SELECT u.id, u.username, u.email, u.role as user_role
    FROM board_access ba
    JOIN users u ON ba.user_id = u.id
    WHERE ba.board_id = ?
  `).all(id);

  res.json({
    ...board,
    columns: columnsWithCards,
    members,
  });
});

// Create board
router.post('/', authenticate, canEdit, (req, res) => {
  const { name, description, is_private } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Board name is required' });
  }

  const result = db.prepare(`
    INSERT INTO boards (name, description, is_private, created_by) VALUES (?, ?, ?, ?)
  `).run(name.trim(), description || null, is_private ? 1 : 0, req.user.id);

  const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(result.lastInsertRowid);

  // Add creator to board_access for private boards
  if (is_private) {
    db.prepare('INSERT INTO board_access (board_id, user_id) VALUES (?, ?)').run(
      board.id,
      req.user.id
    );
  }

  // Create default columns
  const defaultColumns = ['To Do', 'In Progress', 'Done'];
  defaultColumns.forEach((colName, index) => {
    db.prepare('INSERT INTO columns (board_id, name, position) VALUES (?, ?, ?)').run(
      board.id,
      colName,
      index
    );
  });

  res.status(201).json(board);
});

// Update board
router.put('/:id', authenticate, canEdit, (req, res) => {
  const { id } = req.params;
  const { name, description, is_private } = req.body;

  const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(id);

  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }

  if (!hasAccess(req.user.id, req.user.role, board)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  if (name !== undefined && (!name || !name.trim())) {
    return res.status(400).json({ error: 'Board name is required' });
  }

  db.prepare('UPDATE boards SET name = ?, description = ?, is_private = ? WHERE id = ?').run(
    name ? name.trim() : board.name,
    description !== undefined ? description || null : board.description,
    is_private !== undefined ? (is_private ? 1 : 0) : board.is_private,
    id
  );

  // Ensure creator has access if making private
  if (is_private) {
    db.prepare('INSERT OR IGNORE INTO board_access (board_id, user_id) VALUES (?, ?)').run(
      id,
      board.created_by
    );
  }

  const updatedBoard = db.prepare('SELECT * FROM boards WHERE id = ?').get(id);

  res.json(updatedBoard);
});

// Upload board logo
router.post('/:id/logo', authenticate, canEdit, upload.single('logo'), (req, res) => {
  const { id } = req.params;

  const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(id);

  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }

  if (!hasAccess(req.user.id, req.user.role, board)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Delete old logo if exists
  if (board.logo) {
    const oldPath = path.join(uploadsDir, board.logo);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  // Update board with new logo
  db.prepare('UPDATE boards SET logo = ? WHERE id = ?').run(req.file.filename, id);

  res.json({ logo: req.file.filename });
});

// Delete board logo
router.delete('/:id/logo', authenticate, canEdit, (req, res) => {
  const { id } = req.params;

  const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(id);

  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }

  if (!hasAccess(req.user.id, req.user.role, board)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  if (board.logo) {
    const logoPath = path.join(uploadsDir, board.logo);
    if (fs.existsSync(logoPath)) {
      fs.unlinkSync(logoPath);
    }
    db.prepare('UPDATE boards SET logo = NULL WHERE id = ?').run(id);
  }

  res.json({ message: 'Logo removed' });
});

// Get board members
router.get('/:id/members', authenticate, (req, res) => {
  const { id } = req.params;

  const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(id);

  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }

  if (!hasAccess(req.user.id, req.user.role, board)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const members = db.prepare(`
    SELECT u.id, u.username, u.email, u.role as user_role
    FROM board_access ba
    JOIN users u ON ba.user_id = u.id
    WHERE ba.board_id = ?
  `).all(id);

  res.json(members);
});

// Add member to board
router.post('/:id/members', authenticate, canEdit, (req, res) => {
  const { id } = req.params;
  const { user_id, email } = req.body;

  const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(id);

  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }

  if (!hasAccess(req.user.id, req.user.role, board)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  let userId = user_id;

  // Find user by email if user_id not provided
  if (!userId && email) {
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found with this email' });
    }
    userId = user.id;
  }

  if (!userId) {
    return res.status(400).json({ error: 'User ID or email required' });
  }

  // Check if already a member
  const existing = db.prepare(
    'SELECT 1 FROM board_access WHERE board_id = ? AND user_id = ?'
  ).get(id, userId);

  if (existing) {
    return res.status(409).json({ error: 'User is already a member' });
  }

  db.prepare('INSERT INTO board_access (board_id, user_id) VALUES (?, ?)').run(id, userId);

  const member = db.prepare('SELECT id, username, email, role FROM users WHERE id = ?').get(userId);

  res.status(201).json(member);
});

// Remove member from board
router.delete('/:id/members/:userId', authenticate, canEdit, (req, res) => {
  const { id, userId } = req.params;

  const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(id);

  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }

  if (!hasAccess(req.user.id, req.user.role, board)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  // Can't remove the creator
  if (parseInt(userId) === board.created_by) {
    return res.status(400).json({ error: 'Cannot remove the board creator' });
  }

  db.prepare('DELETE FROM board_access WHERE board_id = ? AND user_id = ?').run(id, userId);

  res.json({ message: 'Member removed' });
});

// Delete board (admin only)
router.delete('/:id', authenticate, isAdmin, (req, res) => {
  const { id } = req.params;

  const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(id);

  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }

  // Delete logo file if exists
  if (board.logo) {
    const logoPath = path.join(uploadsDir, board.logo);
    if (fs.existsSync(logoPath)) {
      fs.unlinkSync(logoPath);
    }
  }

  db.prepare('DELETE FROM boards WHERE id = ?').run(id);

  res.json({ message: 'Board deleted successfully' });
});

export default router;
