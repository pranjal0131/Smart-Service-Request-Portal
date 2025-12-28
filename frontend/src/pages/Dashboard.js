import React, { useState, useEffect, useContext } from 'react';
import { API, AuthContext, ToastContext } from '../App';

function Dashboard({ onSelectRequest }) {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [requests, categoryFilter, statusFilter, priorityFilter, searchTerm]);
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/requests');
      setRequests(response.data);
    } catch (err) {
      setError('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...requests];

    if (categoryFilter) {
      filtered = filtered.filter(r => r.category === categoryFilter);
    }
    if (statusFilter) {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    if (priorityFilter) {
      filtered = filtered.filter(r => r.priority === priorityFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const getStatusBadge = (status) => {
    const badgeClass = `badge badge-${status.toLowerCase().replace(' ', '-')}`;
    return <span className={badgeClass}>{status}</span>;
  };

  const getPriorityBadge = (priority) => {
    const badgeClass = `badge badge-${priority.toLowerCase()}`;
    return <span className={badgeClass}>{priority}</span>;
  };

  const getSLAStatus = (slaDeadline) => {
    const now = new Date();
    const deadline = new Date(slaDeadline);
    if (deadline < now) {
      return <span style={{ color: '#d63031', fontWeight: 'bold' }}>⚠️ SLA Breached</span>;
    }
    const daysLeft = Math.floor((deadline - now) / (1000 * 60 * 60 * 24));
    return <span style={{ color: daysLeft <= 1 ? '#f08c00' : '#2f9e44' }}>{daysLeft} days left</span>;
  };

  const handleInlineStatusChange = async (id, newStatus) => {
    const req = requests.find(r => r.id === id);
    if (!req || req.status === newStatus) return;

    try {
      setUpdatingId(id);
      const response = await API.put(`/api/requests/${id}/status`, { status: newStatus });
      // update requests state; filteredRequests will follow via applyFilters
      setRequests(prev => prev.map(r => r.id === id ? response.data : r));
      if (showToast) showToast('Status updated', 'success');
    } catch (err) {
      setError('Failed to update status');
      if (showToast) showToast('Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="container">Loading requests...</div>;
  }

  return (
    <div className="container">
      <h2>Service Requests Dashboard</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Filters */}
      <div className="filter-section">
        <div className="form-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            <option value="IT">IT</option>
            <option value="Admin">Admin</option>
            <option value="Facilities">Facilities</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '4px' }}>
        <strong>Found: {filteredRequests.length} request(s)</strong>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No requests found matching your filters.
        </div>
      ) : (
        <div>
          {filteredRequests.map(request => (
            <div key={request.id} className="card">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', cursor: 'pointer', color: '#667eea' }} onClick={() => onSelectRequest(request.id)}>
                    {request.title}
                  </h3>
                  <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                    {request.description.substring(0, 100)}...
                  </p>
                  <small style={{ color: '#999' }}>
                    By: {request.requesterName} ({request.requesterEmail})
                  </small>
                </div>
                <div style={{ textAlign: 'center' }}>
                  {getPriorityBadge(request.priority)}
                  <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#666' }}>
                    {request.category}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  {getStatusBadge(request.status)}
                  {user && user.role === 'admin' && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <select
                        value={request.status}
                        onChange={(e) => handleInlineStatusChange(request.id, e.target.value)}
                        disabled={updatingId === request.id}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  )}
                  <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    {getSLAStatus(request.slaDeadline)}
                  </div>
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                  <div>{new Date(request.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => onSelectRequest(request.id)}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    View Details
                  </button>
                  {/* Admin-only quick update button to open details for status change */}
                  {user && user.role === 'admin' && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => onSelectRequest(request.id)}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
