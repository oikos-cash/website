import { useState, useRef } from 'react';
import { useKanban, API_BASE } from '../../context/KanbanContext';

export default function BoardSettings({ onClose }) {
  const {
    currentBoard,
    canEdit,
    isAdmin,
    updateBoard,
    uploadBoardLogo,
    deleteBoardLogo,
    addBoardMember,
    removeBoardMember,
    sendInvite,
  } = useKanban();

  const [name, setName] = useState(currentBoard?.name || '');
  const [description, setDescription] = useState(currentBoard?.description || '');
  const [isPrivate, setIsPrivate] = useState(!!currentBoard?.is_private);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [inviting, setInviting] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const [memberEmail, setMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  const fileInputRef = useRef(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Board name is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await updateBoard(currentBoard.id, {
        name: name.trim(),
        description: description.trim() || null,
        is_private: isPrivate,
      });
      setSuccess('Board settings saved');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    try {
      await uploadBoardLogo(currentBoard.id, file);
      setSuccess('Logo uploaded');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogoDelete = async () => {
    setError('');
    try {
      await deleteBoardLogo(currentBoard.id);
      setSuccess('Logo removed');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviting(true);
    setError('');
    setInviteLink('');
    setEmailSent(false);

    try {
      const result = await sendInvite(inviteEmail.trim(), inviteRole, currentBoard.id);
      const link = `${window.location.origin}/kanban?invite=${result.token}`;
      setInviteLink(link);
      setEmailSent(result.emailSent);
      setInviteEmail('');
      if (result.emailSent) {
        setSuccess('Invitation email sent!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setInviting(false);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setSuccess('Link copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim()) return;

    setAddingMember(true);
    setError('');

    try {
      await addBoardMember(currentBoard.id, memberEmail.trim());
      setSuccess(`Member added`);
      setMemberEmail('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from the board?')) return;

    try {
      await removeBoardMember(currentBoard.id, userId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!currentBoard) return null;

  return (
    <div className="kanban-modal-backdrop" onClick={handleBackdropClick}>
      <div className="kanban-modal kanban-settings-modal">
        <div className="kanban-modal-header">
          <h3>Board Settings</h3>
          <button className="kanban-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="kanban-modal-body">
          {error && <div className="kanban-settings-error">{error}</div>}
          {success && <div className="kanban-settings-success">{success}</div>}

          {/* Logo Section */}
          <div className="kanban-settings-section">
            <h4>Board Logo</h4>
            <div className="kanban-logo-section">
              {currentBoard.logo ? (
                <div className="kanban-logo-preview">
                  <img src={`${API_BASE}/uploads/${currentBoard.logo}`} alt="Board logo" />
                  {canEdit && (
                    <button onClick={handleLogoDelete} className="kanban-logo-delete">×</button>
                  )}
                </div>
              ) : (
                <div className="kanban-logo-placeholder">No logo</div>
              )}
              {canEdit && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button
                    className="kanban-btn-secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {currentBoard.logo ? 'Change Logo' : 'Upload Logo'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Board Details */}
          <div className="kanban-settings-section">
            <h4>Board Details</h4>
            <div className="kanban-settings-field">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!canEdit}
              />
            </div>
            <div className="kanban-settings-field">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!canEdit}
                rows={3}
              />
            </div>
            <div className="kanban-settings-field">
              <label className="kanban-checkbox-label">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  disabled={!canEdit}
                />
                <span>Private board (only members can access)</span>
              </label>
            </div>
            {canEdit && (
              <button
                className="kanban-btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>

          {/* Members Section (only for private boards) */}
          {isPrivate && (
            <div className="kanban-settings-section">
              <h4>Board Members</h4>

              {currentBoard.members?.length > 0 ? (
                <ul className="kanban-members-list">
                  {currentBoard.members.map((member) => (
                    <li key={member.id}>
                      <div className="kanban-member-info">
                        <span className="kanban-member-name">{member.username}</span>
                        {member.email && (
                          <span className="kanban-member-email">{member.email}</span>
                        )}
                      </div>
                      {canEdit && member.id !== currentBoard.created_by && (
                        <button
                          className="kanban-btn-danger-small"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          Remove
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="kanban-no-members">No members added yet</p>
              )}

              {canEdit && (
                <form onSubmit={handleAddMember} className="kanban-add-member-form">
                  <input
                    type="email"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="Add existing user by email"
                  />
                  <button
                    type="submit"
                    className="kanban-btn-primary"
                    disabled={addingMember}
                  >
                    Add
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Invite Section */}
          {canEdit && (
            <div className="kanban-settings-section">
              <h4>Invite New User</h4>
              <p className="kanban-settings-hint">
                Generate an invite link for a new user to create an account with access to this board.
              </p>
              <form onSubmit={handleInvite} className="kanban-invite-form">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Email address"
                />
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  {isAdmin && <option value="admin">Admin</option>}
                </select>
                <button
                  type="submit"
                  className="kanban-btn-primary"
                  disabled={inviting}
                >
                  {inviting ? 'Generating...' : 'Generate Invite Link'}
                </button>
              </form>

              {inviteLink && (
                <div className={`kanban-invite-link-box ${emailSent ? 'email-sent' : ''}`}>
                  <p>
                    {emailSent
                      ? 'Email sent! You can also share this link manually:'
                      : 'Share this link with the invitee:'}
                  </p>
                  <div className="kanban-invite-link-row">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      onClick={(e) => e.target.select()}
                    />
                    <button
                      type="button"
                      className="kanban-btn-primary"
                      onClick={copyInviteLink}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
