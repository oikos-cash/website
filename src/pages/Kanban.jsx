import { useState, useEffect } from 'react';
import { KanbanProvider, useKanban, API_BASE } from '../context/KanbanContext';
import LoginForm from '../components/kanban/LoginForm';
import Board from '../components/kanban/Board';
import AdminPanel from '../components/kanban/AdminPanel';
import BoardSettings from '../components/kanban/BoardSettings';
import InviteAccept from '../components/kanban/InviteAccept';
import '../components/kanban/Kanban.css';

function KanbanContent() {
  const {
    user,
    loading,
    logout,
    boards,
    currentBoard,
    loadBoards,
    loadBoard,
    createBoard,
    deleteBoard,
    canEdit,
    isAdmin,
  } = useKanban();

  const [showSidebar, setShowSidebar] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showBoardSettings, setShowBoardSettings] = useState(false);
  const [showBoardForm, setShowBoardForm] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [boardIsPrivate, setBoardIsPrivate] = useState(false);

  // Check for invite token in URL
  const [inviteToken, setInviteToken] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('invite');
  });

  useEffect(() => {
    if (user) {
      loadBoards();
    }
  }, [user]);

  // Show invite acceptance form if there's an invite token
  if (inviteToken && !user) {
    return (
      <InviteAccept
        token={inviteToken}
        onComplete={() => {
          setInviteToken(null);
          window.history.replaceState({}, '', window.location.pathname);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="kanban-loading">
        <div className="kanban-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!boardName.trim()) return;

    try {
      const newBoard = await createBoard(boardName.trim(), boardDescription.trim(), boardIsPrivate);
      setBoardName('');
      setBoardDescription('');
      setBoardIsPrivate(false);
      setShowBoardForm(false);
      loadBoard(newBoard.id);
    } catch (err) {
      console.error('Failed to create board:', err);
    }
  };

  const handleDeleteBoard = async (board) => {
    if (!window.confirm(`Delete "${board.name}" and all its content?`)) return;

    try {
      await deleteBoard(board.id);
    } catch (err) {
      console.error('Failed to delete board:', err);
    }
  };

  return (
    <div className="kanban-app">
      {/* Sidebar */}
      <aside className={`kanban-sidebar ${showSidebar ? 'open' : 'closed'}`}>
        <div className="kanban-sidebar-header">
          <h2>Kanban</h2>
          <button
            className="kanban-sidebar-toggle"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? '◀' : '▶'}
          </button>
        </div>

        {showSidebar && (
          <>
            <div className="kanban-user-info">
              <span className="kanban-user-name">{user.username}</span>
              <span className={`kanban-user-role role-${user.role}`}>{user.role}</span>
            </div>

            <nav className="kanban-sidebar-nav">
              <h3>Boards</h3>
              <ul className="kanban-board-list">
                {boards.map((board) => (
                  <li
                    key={board.id}
                    className={`kanban-board-item ${currentBoard?.id === board.id ? 'active' : ''}`}
                    onClick={() => loadBoard(board.id)}
                  >
                    <div className="kanban-board-item-content">
                      {board.logo && (
                        <img
                          src={`${API_BASE}/uploads/${board.logo}`}
                          alt=""
                          className="kanban-board-logo-small"
                        />
                      )}
                      <span className="kanban-board-name">{board.name}</span>
                      {board.is_private ? (
                        <span className="kanban-board-private" title="Private">🔒</span>
                      ) : null}
                    </div>
                    {canEdit && (
                      <div className="kanban-board-actions">
                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBoard(board);
                            }}
                            title="Delete board"
                            className="danger"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              {canEdit && !showBoardForm && (
                <button
                  className="kanban-create-board-btn"
                  onClick={() => setShowBoardForm(true)}
                >
                  + New Board
                </button>
              )}

              {showBoardForm && canEdit && (
                <form onSubmit={handleCreateBoard} className="kanban-board-form">
                  <input
                    type="text"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    placeholder="Board name"
                    autoFocus
                  />
                  <textarea
                    value={boardDescription}
                    onChange={(e) => setBoardDescription(e.target.value)}
                    placeholder="Description (optional)"
                    rows={2}
                  />
                  <label className="kanban-checkbox-label">
                    <input
                      type="checkbox"
                      checked={boardIsPrivate}
                      onChange={(e) => setBoardIsPrivate(e.target.checked)}
                    />
                    <span>Private board</span>
                  </label>
                  <div className="kanban-board-form-actions">
                    <button type="submit" className="kanban-btn-primary">
                      Create
                    </button>
                    <button
                      type="button"
                      className="kanban-btn-secondary"
                      onClick={() => {
                        setShowBoardForm(false);
                        setBoardName('');
                        setBoardDescription('');
                        setBoardIsPrivate(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </nav>

            <div className="kanban-sidebar-footer">
              {isAdmin && (
                <button
                  className="kanban-admin-btn"
                  onClick={() => setShowAdminPanel(true)}
                >
                  Admin Panel
                </button>
              )}
              <button className="kanban-logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          </>
        )}
      </aside>

      {/* Main content */}
      <main className="kanban-main">
        {currentBoard && canEdit && (
          <button
            className="kanban-settings-btn"
            onClick={() => setShowBoardSettings(true)}
            title="Board Settings"
          >
            ⚙️ Settings
          </button>
        )}
        <Board />
      </main>

      {/* Modals */}
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
      {showBoardSettings && currentBoard && (
        <BoardSettings onClose={() => setShowBoardSettings(false)} />
      )}
    </div>
  );
}

export default function Kanban() {
  return (
    <KanbanProvider>
      <KanbanContent />
    </KanbanProvider>
  );
}
