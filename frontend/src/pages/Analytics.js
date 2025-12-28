import React, { useState, useEffect } from 'react';
import { API } from '../App';

function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/analytics/stats');
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading analytics...</div>;
  }

  if (!stats) {
    return <div className="container">No data available</div>;
  }

  return (
    <div className="container">
      <h2>Analytics & Insights</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Key Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalRequests}</h3>
          <p>Total Requests</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h3>{stats.openRequests}</h3>
          <p>Open Requests</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <h3>{stats.inProgressRequests}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <h3>{stats.resolvedRequests}</h3>
          <p>Resolved</p>
        </div>
      </div>

      {/* By Category */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h3 style={{ marginTop: 0 }}>Requests by Category</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {Object.entries(stats.byCategory).map(([category, count]) => (
            <div key={category} style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '4px', textAlign: 'center' }}>
              <h4 style={{ margin: 0, color: '#667eea' }}>{category}</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginTop: '0.5rem' }}>{count}</div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                ({Math.round((count / stats.totalRequests) * 100)}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* By Priority */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h3 style={{ marginTop: 0 }}>Requests by Priority</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {Object.entries(stats.byPriority).map(([priority, count]) => {
            const colors = { 'High': '#d63031', 'Medium': '#f08c00', 'Low': '#2f9e44' };
            return (
              <div key={priority} style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '4px', textAlign: 'center' }}>
                <h4 style={{ margin: 0, color: colors[priority] }}>{priority}</h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors[priority], marginTop: '0.5rem' }}>{count}</div>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                  ({Math.round((count / stats.totalRequests) * 100)}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h3 style={{ marginTop: 0 }}>Performance Metrics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h4 style={{ color: '#667eea', margin: '0 0 0.5rem 0' }}>Average Resolution Time</h4>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
              {stats.averageResolutionTime} days
            </div>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
              Average time from creation to resolution
            </p>
          </div>
          <div>
            <h4 style={{ color: '#d63031', margin: '0 0 0.5rem 0' }}>⚠️ SLA Breaches</h4>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d63031' }}>
              {stats.slaBreach}
            </div>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
              Requests past SLA deadline
            </p>
          </div>
          <div>
            <h4 style={{ color: '#2f9e44', margin: '0 0 0.5rem 0' }}>Resolution Rate</h4>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2f9e44' }}>
              {stats.totalRequests > 0 ? Math.round((stats.resolvedRequests / stats.totalRequests) * 100) : 0}%
            </div>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
              Of all requests resolved
            </p>
          </div>
        </div>
      </div>

      <button className="btn btn-secondary" onClick={fetchStats}>
        Refresh Analytics
      </button>
    </div>
  );
}

export default Analytics;
