import { useState, useEffect } from 'react';
import { useKanban } from '../../context/KanbanContext';

export default function InviteAccept({ token, onComplete }) {
  const { getInviteDetails, acceptInvite } = useKanban();

  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadInvite();
  }, [token]);

  const loadInvite = async () => {
    try {
      const data = await getInviteDetails(token);
      setInvite(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);

    try {
      await acceptInvite(token, username.trim(), password);
      onComplete();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="kanban-login-container">
        <div className="kanban-login-card">
          <div className="kanban-loading-inline">Loading invitation...</div>
        </div>
      </div>
    );
  }

  if (error && !invite) {
    return (
      <div className="kanban-login-container">
        <div className="kanban-login-card">
          <div className="kanban-login-header">
            <h1>Invalid Invitation</h1>
            <p>{error}</p>
          </div>
          <button
            className="kanban-login-btn"
            onClick={() => window.location.href = '/kanban'}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="kanban-login-container">
      <div className="kanban-login-card">
        <div className="kanban-login-header">
          <h1>Accept Invitation</h1>
          <p>
            {invite.invited_by} invited you to join
            {invite.board_name ? ` "${invite.board_name}"` : ' Kanban'}
          </p>
        </div>

        <div className="kanban-invite-details">
          <div className="kanban-invite-detail">
            <span className="label">Email:</span>
            <span className="value">{invite.email}</span>
          </div>
          <div className="kanban-invite-detail">
            <span className="label">Role:</span>
            <span className={`kanban-user-role role-${invite.role}`}>{invite.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="kanban-login-form">
          {error && <div className="kanban-login-error">{error}</div>}

          <div className="kanban-form-group">
            <label htmlFor="username">Choose a Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              autoComplete="username"
            />
          </div>

          <div className="kanban-form-group">
            <label htmlFor="password">Create Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="kanban-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="kanban-login-btn" disabled={submitting}>
            {submitting ? 'Creating Account...' : 'Create Account & Join'}
          </button>
        </form>
      </div>
    </div>
  );
}
