import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import db from '../db/database.js';
import { authenticate, isAdmin, canEdit, generateToken } from '../middleware/auth.js';

const router = Router();

// Send invitation email via Resend API
async function sendInviteEmail(email, token, inviterName, boardName) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('RESEND_API_KEY not set, skipping email');
    return false;
  }

  const baseUrl = process.env.APP_URL || 'http://localhost:5173';
  const inviteUrl = `${baseUrl}/kanban?invite=${token}`;

  const subject = boardName
    ? `You've been invited to join "${boardName}" on Kanban`
    : `You've been invited to join Kanban`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #f8bd45; margin-bottom: 20px;">Kanban Board Invitation</h2>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        ${inviterName} has invited you to join ${boardName ? `the board "<strong>${boardName}</strong>" on ` : ''}Kanban.
      </p>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        Click the button below to accept the invitation and create your account:
      </p>
      <a href="${inviteUrl}" style="display: inline-block; background: #f8bd45; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 24px 0;">
        Accept Invitation
      </a>
      <p style="color: #888; font-size: 14px; margin-top: 30px;">This invitation expires in 7 days.</p>
      <p style="color: #888; font-size: 14px;">If you didn't expect this invitation, you can ignore this email.</p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'Kanban <onboarding@resend.dev>',
        to: [email],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
      return false;
    }

    console.log(`Invite email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send invite email:', error);
    return false;
  }
}

// Send invitation (admin or editor for board invites)
router.post('/', authenticate, async (req, res) => {
  const { email, role, board_id } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  // Only admins can invite admins
  if (role === 'admin' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can invite admin users' });
  }

  // Check if user already exists with this email
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existingUser) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  // Check for pending invitation
  const existingInvite = db.prepare(
    "SELECT id FROM invitations WHERE email = ? AND accepted_at IS NULL AND expires_at > datetime('now')"
  ).get(email);
  if (existingInvite) {
    return res.status(409).json({ error: 'Pending invitation already exists for this email' });
  }

  // Get board name if board_id provided
  let boardName = null;
  if (board_id) {
    const board = db.prepare('SELECT name FROM boards WHERE id = ?').get(board_id);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    boardName = board.name;
  }

  // Create invitation token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  db.prepare(`
    INSERT INTO invitations (email, token, role, board_id, invited_by, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(email, token, role || 'viewer', board_id || null, req.user.id, expiresAt);

  // Send email and report status
  const emailSent = await sendInviteEmail(email, token, req.user.username, boardName);

  res.status(201).json({
    message: emailSent ? 'Invitation sent' : 'Invitation created (email not sent)',
    emailSent,
    token, // Always return token for manual sharing
  });
});

// Get invitation details (public - for accept page)
router.get('/:token', (req, res) => {
  const { token } = req.params;

  const invite = db.prepare(`
    SELECT i.*, u.username as invited_by_name, b.name as board_name
    FROM invitations i
    LEFT JOIN users u ON i.invited_by = u.id
    LEFT JOIN boards b ON i.board_id = b.id
    WHERE i.token = ?
  `).get(token);

  if (!invite) {
    return res.status(404).json({ error: 'Invitation not found' });
  }

  if (invite.accepted_at) {
    return res.status(410).json({ error: 'Invitation already used' });
  }

  if (new Date(invite.expires_at) < new Date()) {
    return res.status(410).json({ error: 'Invitation expired' });
  }

  res.json({
    email: invite.email,
    role: invite.role,
    board_name: invite.board_name,
    invited_by: invite.invited_by_name,
    expires_at: invite.expires_at,
  });
});

// Accept invitation and create account
router.post('/:token/accept', (req, res) => {
  const { token } = req.params;
  const { username, password } = req.body;

  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Username is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const invite = db.prepare('SELECT * FROM invitations WHERE token = ?').get(token);

  if (!invite) {
    return res.status(404).json({ error: 'Invitation not found' });
  }

  if (invite.accepted_at) {
    return res.status(410).json({ error: 'Invitation already used' });
  }

  if (new Date(invite.expires_at) < new Date()) {
    return res.status(410).json({ error: 'Invitation expired' });
  }

  // Check username availability
  const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username.trim());
  if (existingUser) {
    return res.status(409).json({ error: 'Username already taken' });
  }

  // Create user
  const passwordHash = bcrypt.hashSync(password, 10);
  const userResult = db.prepare(`
    INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)
  `).run(username.trim(), invite.email, passwordHash, invite.role);

  // Mark invitation as accepted
  db.prepare("UPDATE invitations SET accepted_at = datetime('now') WHERE id = ?").run(invite.id);

  // Add user to board if specified
  if (invite.board_id) {
    db.prepare('INSERT OR IGNORE INTO board_access (board_id, user_id) VALUES (?, ?)').run(
      invite.board_id,
      userResult.lastInsertRowid
    );
  }

  // Generate token for auto-login
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userResult.lastInsertRowid);
  const authToken = generateToken(user);

  res.json({
    message: 'Account created successfully',
    token: authToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

// List pending invitations (admin only)
router.get('/', authenticate, isAdmin, (req, res) => {
  const invites = db.prepare(`
    SELECT i.*, u.username as invited_by_name, b.name as board_name
    FROM invitations i
    LEFT JOIN users u ON i.invited_by = u.id
    LEFT JOIN boards b ON i.board_id = b.id
    WHERE i.accepted_at IS NULL
    ORDER BY i.created_at DESC
  `).all();

  res.json(invites);
});

// Delete/cancel invitation (admin only)
router.delete('/:id', authenticate, isAdmin, (req, res) => {
  const { id } = req.params;

  const invite = db.prepare('SELECT * FROM invitations WHERE id = ?').get(id);
  if (!invite) {
    return res.status(404).json({ error: 'Invitation not found' });
  }

  db.prepare('DELETE FROM invitations WHERE id = ?').run(id);

  res.json({ message: 'Invitation cancelled' });
});

export default router;
