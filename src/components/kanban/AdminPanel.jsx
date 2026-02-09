import { useState, useEffect } from 'react';
import { useKanban } from '../../context/KanbanContext';

export default function AdminPanel({ onClose }) {
  const { user, getUsers, createUser, updateUser, deleteUser, changePassword } = useKanban();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Create user form
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('viewer');
  const [creating, setCreating] = useState(false);

  // Change password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      const newUser = await createUser(newUsername, newPassword, newRole);
      setUsers([newUser, ...users]);
      setNewUsername('');
      setNewPassword('');
      setNewRole('viewer');
      setShowCreateForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const updated = await updateUser(userId, { role: newRole });
      setUsers(users.map((u) => (u.id === userId ? updated : u)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;

    try {
      await deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setChangingPassword(true);

    try {
      await changePassword(currentPassword, newUserPassword);
      setCurrentPassword('');
      setNewUserPassword('');
      setShowPasswordForm(false);
      alert('Password changed successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="kanban-modal-backdrop" onClick={handleBackdropClick}>
      <div className="kanban-modal kanban-admin-modal">
        <div className="kanban-modal-header">
          <h3>Admin Panel</h3>
          <button className="kanban-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="kanban-modal-body">
          {error && <div className="kanban-admin-error">{error}</div>}

          {/* Change Password Section */}
          <div className="kanban-admin-section">
            <div className="kanban-admin-section-header">
              <h4>Your Account</h4>
              {!showPasswordForm && (
                <button
                  className="kanban-btn-secondary"
                  onClick={() => setShowPasswordForm(true)}
                >
                  Change Password
                </button>
              )}
            </div>

            {showPasswordForm && (
              <form onSubmit={handleChangePassword} className="kanban-admin-form">
                <div className="kanban-form-row">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    required
                  />
                  <input
                    type="password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="New password (min 6 chars)"
                    required
                    minLength={6}
                  />
                  <button
                    type="submit"
                    className="kanban-btn-primary"
                    disabled={changingPassword}
                  >
                    {changingPassword ? 'Saving...' : 'Update'}
                  </button>
                  <button
                    type="button"
                    className="kanban-btn-secondary"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword('');
                      setNewUserPassword('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* User Management Section */}
          <div className="kanban-admin-section">
            <div className="kanban-admin-section-header">
              <h4>User Management</h4>
              {!showCreateForm && (
                <button
                  className="kanban-btn-primary"
                  onClick={() => setShowCreateForm(true)}
                >
                  + Add User
                </button>
              )}
            </div>

            {showCreateForm && (
              <form onSubmit={handleCreateUser} className="kanban-admin-form">
                <div className="kanban-form-row">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Username"
                    required
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Password (min 6 chars)"
                    required
                    minLength={6}
                  />
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button type="submit" className="kanban-btn-primary" disabled={creating}>
                    {creating ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    type="button"
                    className="kanban-btn-secondary"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {loading ? (
              <p>Loading users...</p>
            ) : (
              <table className="kanban-admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        {u.username}
                        {u.id === user.id && <span className="kanban-you-badge">(you)</span>}
                      </td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          disabled={u.id === user.id}
                        >
                          <option value="viewer">Viewer</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="kanban-btn-danger-small"
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={u.id === user.id}
                          title={u.id === user.id ? "Can't delete yourself" : 'Delete user'}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
