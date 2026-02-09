# Kanban Board - Project Context

## Overview
Self-hosted Trello-like kanban board at `/kanban` with SQLite database, password protection, and multi-user roles (Admin, Editor, Viewer).

## Architecture

```
/data2/code/Oikos/new-home/
├── server/                    # Express backend (port 3002)
│   ├── index.js              # Entry point, loads .env from parent dir
│   ├── db/
│   │   ├── schema.sql        # SQLite schema
│   │   ├── database.js       # DB connection
│   │   └── kanban.db         # SQLite database file
│   ├── routes/
│   │   ├── auth.js           # Login/logout/session
│   │   ├── users.js          # User management (admin)
│   │   ├── boards.js         # Board CRUD, logo upload, members
│   │   ├── columns.js        # Column CRUD
│   │   ├── cards.js          # Card CRUD
│   │   └── invites.js        # Invitation system (Resend API)
│   ├── middleware/
│   │   └── auth.js           # JWT auth, role checks
│   ├── uploads/              # Board logos stored here
│   └── package.json
├── src/
│   ├── pages/
│   │   └── Kanban.jsx        # Main kanban page
│   ├── components/kanban/
│   │   ├── Board.jsx         # Board display with columns
│   │   ├── Column.jsx        # Column with cards
│   │   ├── Card.jsx          # Individual card
│   │   ├── CardModal.jsx     # Card detail/edit modal
│   │   ├── LoginForm.jsx     # Login form
│   │   ├── AdminPanel.jsx    # User management
│   │   ├── BoardSettings.jsx # Logo, privacy, members, invites
│   │   ├── InviteAccept.jsx  # Accept invitation page
│   │   └── Kanban.css        # Dark theme styling
│   └── context/
│       └── KanbanContext.jsx # Auth + board state management
├── .env                      # Environment variables
└── vite.config.js            # Proxy /api to port 3002
```

## Database Schema (SQLite)

```sql
-- Users
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT CHECK(role IN ('admin', 'editor', 'viewer')) DEFAULT 'viewer',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Invitations
CREATE TABLE invitations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'viewer',
  board_id INTEGER REFERENCES boards(id),
  invited_by INTEGER REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  accepted_at DATETIME
);

-- Boards
CREATE TABLE boards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,                -- filename in uploads/
  is_private INTEGER DEFAULT 0,
  created_by INTEGER REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Board access (for private boards)
CREATE TABLE board_access (
  board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (board_id, user_id)
);

-- Columns
CREATE TABLE columns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INTEGER NOT NULL
);

-- Cards
CREATE TABLE cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  column_id INTEGER REFERENCES columns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  labels TEXT,              -- JSON array
  due_date DATE,
  position INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## User Roles & Permissions

| Action | Admin | Editor | Viewer |
|--------|-------|--------|--------|
| View boards | ✓ | ✓ | ✓ |
| Create/edit boards | ✓ | ✓ | ✗ |
| Delete boards | ✓ | ✗ | ✗ |
| Create/edit columns | ✓ | ✓ | ✗ |
| Create/edit/move cards | ✓ | ✓ | ✗ |
| Manage users | ✓ | ✗ | ✗ |
| Send invites | ✓ | ✓ | ✗ |

## Environment Variables (.env in project root)

```env
# Required
RESEND_API_KEY=re_xxxxx           # From resend.com

# Required for sending to others (not just yourself)
RESEND_FROM=Kanban <noreply@yourdomain.com>

# Optional
APP_URL=https://yourdomain.com    # For invite email links (defaults to localhost:5173)
PORT=3002                         # Server port
CORS_ORIGIN=http://localhost:5173 # Frontend origin
JWT_SECRET=your-secret            # Auto-generated if not set
```

## Running the Server

```bash
cd server
npm install
npm start        # or: npm run dev (with --watch)
```

Server runs on port 3002. Vite proxies `/api` requests to it.

## API Endpoints

### Auth
- `POST /api/auth/login` - Login (username, password)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Boards
- `GET /api/boards` - List boards
- `POST /api/boards` - Create board
- `GET /api/boards/:id` - Get board with columns/cards
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board
- `POST /api/boards/:id/logo` - Upload logo (multipart)
- `DELETE /api/boards/:id/logo` - Delete logo
- `POST /api/boards/:id/members` - Add member (email)
- `DELETE /api/boards/:id/members/:userId` - Remove member

### Columns
- `POST /api/boards/:boardId/columns` - Create column
- `PUT /api/columns/:id` - Update column
- `DELETE /api/columns/:id` - Delete column
- `PUT /api/boards/:boardId/columns/reorder` - Reorder columns

### Cards
- `POST /api/columns/:columnId/cards` - Create card
- `PUT /api/cards/:id` - Update card
- `DELETE /api/cards/:id` - Delete card
- `PUT /api/cards/:id/move` - Move card
- `PUT /api/columns/:columnId/cards/reorder` - Reorder cards

### Invites
- `POST /api/invites` - Create invite (returns token + sends email via Resend)
- `GET /api/invites/:token` - Get invite details
- `POST /api/invites/:token/accept` - Accept invite & create account
- `GET /api/invites` - List pending invites (admin)
- `DELETE /api/invites/:id` - Cancel invite (admin)

## Current State

- **Admin user**: username `admin`, password `1likepants`
- **Email invites**: Uses Resend API. Copy-able invite link always shown as fallback.
- **Resend setup**: User has API key configured. Needs to add `RESEND_FROM` with verified domain to send to others.

## Key Implementation Details

1. **JWT Auth**: Tokens stored in localStorage, sent via Authorization header
2. **File uploads**: Multer saves to `server/uploads/`, served at `/api/uploads/`
3. **Private boards**: Only members (via board_access table) can see them
4. **Invite flow**: Generate token → email sent (or copy link) → recipient creates account → auto-added to board
5. **Drag & drop**: Native HTML5 drag/drop for columns and cards
6. **Theme**: Dark theme with gold accent (#f8bd45), matches site style

## Important Notes

- **Never reset the database** without user permission. Use migration scripts instead.
- Server loads `.env` from project root (parent of server dir)
- Resend test domain only sends to account owner's email. Verify domain for others.
