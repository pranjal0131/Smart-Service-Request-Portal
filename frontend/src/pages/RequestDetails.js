import React, { useState, useEffect, useContext } from 'react';
import { API, AuthContext, ToastContext } from '../App';

function RequestDetails({ requestId, onBack }) {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [assignee, setAssignee] = useState('');

  useEffect(() => {
    fetchRequest();
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [requestId]);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await API.get('/api/users');
      setUsersList(res.data);
    } catch (err) {
      // ignore silently; admin may fetch when needed
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/api/requests/${requestId}`);
      setRequest(response.data);
      setNewStatus(response.data.status);
    } catch (err) {
      setError('Failed to fetch request');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setCommentLoading(true);
    try {
      const response = await API.post(`/api/requests/${requestId}/comments`, { comment });
      setRequest(response.data);
      setComment('');
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (newStatus === request.status) return;

    setUpdating(true);
    try {
      const response = await API.put(`/api/requests/${requestId}/status`, { status: newStatus });
      setRequest(response.data);
      if (showToast) showToast('Status updated', 'success');
    } catch (err) {
      setError('Failed to update status');
      if (showToast) showToast('Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleAssign = async () => {
    if (!assignee) return;
    try {
      setUpdating(true);
      const response = await API.put(`/api/requests/${requestId}/assign`, { assigneeEmail: assignee });
      setRequest(response.data);
      if (showToast) showToast('Assigned successfully', 'success');
    } catch (err) {
      setError('Failed to assign request');
      if (showToast) showToast('Failed to assign request', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <div style={{ marginTop: '1rem' }}>Loading...</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container">
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <div style={{ marginTop: '1rem', color: '#d63031' }}>Request not found</div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      'Open': '#1971c2',
      'In Progress': '#f08c00',
      'Resolved': '#2f9e44'
    };
    return colors[status] || '#666';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': '#d63031',
      'Medium': '#f08c00',
      'Low': '#2f9e44'
    };
    return colors[priority] || '#666';
  };

  return (
    <div className="container">
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '1rem' }}>
        ← Back to Dashboard
      </button>

      {error && <div className="error-message">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Main Content */}
        <div>
          <h2>{request.title}</h2>

          <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f9f9f9', borderRadius: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <strong>Status:</strong>
                <div style={{ color: getStatusColor(request.status), fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {request.status}
                </div>
              </div>
              <div>
                <strong>Priority:</strong>
                <div style={{ color: getPriorityColor(request.priority), fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {request.priority}
                </div>
              </div>
              <div>
                <strong>Category:</strong>
                <div>{request.category}</div>
              </div>
              <div>
                <strong>Assigned to:</strong>
                <div>{request.assignedTo || 'Unassigned'}</div>
              </div>
              <div>
                <strong>Created:</strong>
                <div>{new Date(request.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <strong>SLA Deadline:</strong>
                <div style={{ color: new Date(request.slaDeadline) < new Date() ? '#d63031' : '#2f9e44' }}>
                  {new Date(request.slaDeadline).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3>Description</h3>
            <p style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '4px', lineHeight: '1.6' }}>
              {request.description}
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3>Requester Information</h3>
            <p><strong>Name:</strong> {request.requesterName}</p>
            <p><strong>Email:</strong> {request.requesterEmail}</p>
          </div>

          {/* History */}
          {request.history && request.history.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3>Status History</h3>
              <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '4px' }}>
                {request.history.map((entry, idx) => (
                  <div key={idx} style={{ paddingBottom: '0.8rem', borderBottom: idx < request.history.length - 1 ? '1px solid #ddd' : 'none' }}>
                    <strong>{entry.status}</strong> - {new Date(entry.changedAt).toLocaleString()} by {entry.changedBy}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div>
            <h3>Comments & Updates</h3>

            {request.comments && request.comments.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                {request.comments.map(cmt => (
                  <div key={cmt.id} style={{ background: '#f9f9f9', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
                    <strong>{cmt.author}</strong> <small style={{ color: '#999' }}>({new Date(cmt.createdAt).toLocaleString()})</small>
                    <p style={{ margin: '0.5rem 0 0 0' }}>{cmt.text}</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddComment}>
              <div className="form-group">
                <label>Add Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment or update..."
                  style={{ minHeight: '100px' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={commentLoading}>
                {commentLoading ? 'Adding...' : 'Add Comment'}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '4px', height: 'fit-content' }}>
          <h3 style={{ marginTop: 0 }}>Update Status</h3>

          {user?.role === 'admin' ? (
            <>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Assign To:</label>
                {usersLoading ? (
                  <div>Loading users...</div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select value={assignee || request.assignedTo || ''} onChange={(e) => setAssignee(e.target.value)}>
                      <option value="">Unassigned</option>
                      {usersList.map(u => (
                        <option key={u.email} value={u.email}>{u.name} ({u.email})</option>
                      ))}
                    </select>
                    <button className="btn btn-secondary" onClick={handleAssign} disabled={updating || (!assignee && !request.assignedTo)}>
                      {updating ? 'Assigning...' : 'Assign'}
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Change Status to:</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleStatusUpdate}
                disabled={updating || newStatus === request.status}
                style={{ width: '100%' }}
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </>
          ) : (
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Only admins can update request status.
            </p>
          )}

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'white', borderRadius: '4px', borderLeft: '4px solid #667eea' }}>
            <h4 style={{ marginTop: 0 }}>📊 Request Stats</h4>
            <p><strong>Days Open:</strong> {Math.floor((new Date() - new Date(request.createdAt)) / (1000 * 60 * 60 * 24))}</p>
            <p><strong>Comments:</strong> {request.comments?.length || 0}</p>
            <p><strong>Status Changes:</strong> {request.history?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestDetails;
