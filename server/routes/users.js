import { Router } from 'express';
import bcrypt from 'bcrypt';
import db from '../db/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = Router();

// Get all users (admin only)
router.get('/', authenticate, isAdmin, (req, res) => {
  const users = db.prepare(`
    SELECT id, username, role, created_at FROM users ORDER BY created_at DESC
  `).all();

  res.json(users);
});

// Create user (admin only)
router.post('/', authenticate, isAdmin, (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Username is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const validRoles = ['admin', 'editor', 'viewer'];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Must be admin, editor, or viewer' });
  }

  // Check if username exists
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username.trim());

  if (existing) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const result = db.prepare(`
    INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)
  `).run(username.trim(), passwordHash, role || 'viewer');

  const user = db.prepare('SELECT id, username, role, created_at FROM users WHERE id = ?').get(
    result.lastInsertRowid
  );

  res.status(201).json(user);
});

// Update user role (admin only)
router.put('/:id', authenticate, isAdmin, (req, res) => {
  const { id } = req.params;
  const { role, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Prevent demoting yourself
  if (parseInt(id) === req.user.id && role && role !== 'admin') {
    return res.status(400).json({ error: 'Cannot change your own role' });
  }

  const validRoles = ['admin', 'editor', 'viewer'];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Must be admin, editor, or viewer' });
  }

  // Update role
  if (role) {
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
  }

  // Update password if provided
  if (password) {
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const passwordHash = bcrypt.hashSync(password, 10);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, id);
  }

  const updatedUser = db.prepare('SELECT id, username, role, created_at FROM users WHERE id = ?').get(id);

  res.json(updatedUser);
});

// Delete user (admin only)
router.delete('/:id', authenticate, isAdmin, (req, res) => {
  const { id } = req.params;

  // Prevent deleting yourself
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if this is the last admin
  if (user.role === 'admin') {
    const adminCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get();
    if (adminCount.count <= 1) {
      return res.status(400).json({ error: 'Cannot delete the last admin user' });
    }
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(id);

  res.json({ message: 'User deleted successfully' });
});

export default router;
