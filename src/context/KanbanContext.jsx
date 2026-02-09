import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const KanbanContext = createContext(null);

const API_BASE = '/api';

export function KanbanProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('kanban_token'));
  const [loading, setLoading] = useState(true);
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);

  // API helper
  const fetchApi = useCallback(async (endpoint, options = {}) => {
    const headers = {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }, [token]);

  // Check auth on mount or handle invite token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteToken = params.get('invite');

    if (inviteToken) {
      // Don't auto-login if there's an invite token
      setLoading(false);
      return;
    }

    if (token) {
      fetchApi('/auth/me')
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('kanban_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, fetchApi]);

  // Auth functions
  const login = async (username, password) => {
    const data = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    localStorage.setItem('kanban_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('kanban_token');
    setToken(null);
    setUser(null);
    setBoards([]);
    setCurrentBoard(null);
  };

  const changePassword = async (currentPassword, newPassword) => {
    await fetchApi('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  };

  // Board functions
  const loadBoards = async () => {
    const data = await fetchApi('/boards');
    setBoards(data);
    return data;
  };

  const loadBoard = async (boardId) => {
    const data = await fetchApi(`/boards/${boardId}`);
    setCurrentBoard(data);
    return data;
  };

  const createBoard = async (name, description, isPrivate = false) => {
    const data = await fetchApi('/boards', {
      method: 'POST',
      body: JSON.stringify({ name, description, is_private: isPrivate }),
    });
    setBoards((prev) => [data, ...prev]);
    return data;
  };

  const updateBoard = async (boardId, updates) => {
    const data = await fetchApi(`/boards/${boardId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    setBoards((prev) => prev.map((b) => (b.id === boardId ? { ...b, ...data } : b)));
    if (currentBoard?.id === boardId) {
      setCurrentBoard((prev) => ({ ...prev, ...data }));
    }
    return data;
  };

  const deleteBoard = async (boardId) => {
    await fetchApi(`/boards/${boardId}`, { method: 'DELETE' });
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
    if (currentBoard?.id === boardId) {
      setCurrentBoard(null);
    }
  };

  // Board logo
  const uploadBoardLogo = async (boardId, file) => {
    const formData = new FormData();
    formData.append('logo', file);

    const data = await fetchApi(`/boards/${boardId}/logo`, {
      method: 'POST',
      body: formData,
    });

    setBoards((prev) => prev.map((b) => (b.id === boardId ? { ...b, logo: data.logo } : b)));
    if (currentBoard?.id === boardId) {
      setCurrentBoard((prev) => ({ ...prev, logo: data.logo }));
    }
    return data;
  };

  const deleteBoardLogo = async (boardId) => {
    await fetchApi(`/boards/${boardId}/logo`, { method: 'DELETE' });
    setBoards((prev) => prev.map((b) => (b.id === boardId ? { ...b, logo: null } : b)));
    if (currentBoard?.id === boardId) {
      setCurrentBoard((prev) => ({ ...prev, logo: null }));
    }
  };

  // Board members
  const addBoardMember = async (boardId, email) => {
    const data = await fetchApi(`/boards/${boardId}/members`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    if (currentBoard?.id === boardId) {
      setCurrentBoard((prev) => ({
        ...prev,
        members: [...(prev.members || []), data],
      }));
    }
    return data;
  };

  const removeBoardMember = async (boardId, userId) => {
    await fetchApi(`/boards/${boardId}/members/${userId}`, { method: 'DELETE' });
    if (currentBoard?.id === boardId) {
      setCurrentBoard((prev) => ({
        ...prev,
        members: prev.members?.filter((m) => m.id !== userId) || [],
      }));
    }
  };

  // Column functions
  const createColumn = async (boardId, name) => {
    const data = await fetchApi(`/columns/boards/${boardId}/columns`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    if (currentBoard?.id === boardId) {
      setCurrentBoard((prev) => ({
        ...prev,
        columns: [...(prev.columns || []), data],
      }));
    }
    return data;
  };

  const updateColumn = async (columnId, name) => {
    const data = await fetchApi(`/columns/${columnId}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
    if (currentBoard) {
      setCurrentBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((c) => (c.id === columnId ? { ...c, ...data } : c)),
      }));
    }
    return data;
  };

  const deleteColumn = async (columnId) => {
    await fetchApi(`/columns/${columnId}`, { method: 'DELETE' });
    if (currentBoard) {
      setCurrentBoard((prev) => ({
        ...prev,
        columns: prev.columns.filter((c) => c.id !== columnId),
      }));
    }
  };

  const reorderColumns = async (boardId, columnIds) => {
    await fetchApi('/columns/reorder', {
      method: 'PUT',
      body: JSON.stringify({ boardId, columnIds }),
    });
  };

  // Card functions
  const createCard = async (columnId, title, description, labels, due_date) => {
    const data = await fetchApi(`/cards/columns/${columnId}/cards`, {
      method: 'POST',
      body: JSON.stringify({ title, description, labels, due_date }),
    });
    if (currentBoard) {
      setCurrentBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((c) =>
          c.id === columnId ? { ...c, cards: [...(c.cards || []), data] } : c
        ),
      }));
    }
    return data;
  };

  const updateCard = async (cardId, updates) => {
    const data = await fetchApi(`/cards/${cardId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (currentBoard) {
      setCurrentBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((c) => ({
          ...c,
          cards: c.cards.map((card) => (card.id === cardId ? data : card)),
        })),
      }));
    }
    return data;
  };

  const deleteCard = async (cardId) => {
    await fetchApi(`/cards/${cardId}`, { method: 'DELETE' });
    if (currentBoard) {
      setCurrentBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((c) => ({
          ...c,
          cards: c.cards.filter((card) => card.id !== cardId),
        })),
      }));
    }
  };

  const moveCard = async (cardId, columnId, position) => {
    const data = await fetchApi(`/cards/${cardId}/move`, {
      method: 'PUT',
      body: JSON.stringify({ column_id: columnId, position }),
    });
    return data;
  };

  const reorderCards = async (columnId, cardIds) => {
    await fetchApi('/cards/reorder', {
      method: 'PUT',
      body: JSON.stringify({ columnId, cardIds }),
    });
  };

  // User management (admin)
  const getUsers = async () => {
    return fetchApi('/users');
  };

  const createUser = async (username, password, role) => {
    return fetchApi('/users', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    });
  };

  const updateUser = async (userId, updates) => {
    return fetchApi(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  };

  const deleteUser = async (userId) => {
    return fetchApi(`/users/${userId}`, { method: 'DELETE' });
  };

  // Invitations
  const sendInvite = async (email, role, boardId = null) => {
    return fetchApi('/invites', {
      method: 'POST',
      body: JSON.stringify({ email, role, board_id: boardId }),
    });
  };

  const getInviteDetails = async (inviteToken) => {
    const response = await fetch(`${API_BASE}/invites/${inviteToken}`);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }
    return response.json();
  };

  const acceptInvite = async (inviteToken, username, password) => {
    const response = await fetch(`${API_BASE}/invites/${inviteToken}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    const data = await response.json();
    localStorage.setItem('kanban_token', data.token);
    setToken(data.token);
    setUser(data.user);

    // Clear invite token from URL
    window.history.replaceState({}, '', window.location.pathname);

    return data;
  };

  const getPendingInvites = async () => {
    return fetchApi('/invites');
  };

  const cancelInvite = async (inviteId) => {
    return fetchApi(`/invites/${inviteId}`, { method: 'DELETE' });
  };

  // Permissions helpers
  const canEdit = user?.role === 'admin' || user?.role === 'editor';
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    token,
    loading,
    boards,
    currentBoard,
    canEdit,
    isAdmin,
    // Auth
    login,
    logout,
    changePassword,
    // Boards
    loadBoards,
    loadBoard,
    createBoard,
    updateBoard,
    deleteBoard,
    setCurrentBoard,
    uploadBoardLogo,
    deleteBoardLogo,
    // Board members
    addBoardMember,
    removeBoardMember,
    // Columns
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    // Cards
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    reorderCards,
    // Users
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    // Invites
    sendInvite,
    getInviteDetails,
    acceptInvite,
    getPendingInvites,
    cancelInvite,
  };

  return <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>;
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
}
