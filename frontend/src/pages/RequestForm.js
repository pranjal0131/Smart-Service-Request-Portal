import React, { useState } from 'react';
import { API } from '../App';

function RequestForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'IT',
    description: '',
    priority: 'Medium',
    requesterName: '',
    requesterEmail: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await API.post('/api/requests', formData);
      setSuccess('Request created successfully!');
      setFormData({
        title: '',
        category: 'IT',
        description: '',
        priority: 'Medium',
        requesterName: '',
        requesterEmail: ''
      });
      
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Create New Service Request</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Brief title of your request"
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="IT">IT</option>
            <option value="Admin">Admin</option>
            <option value="Facilities">Facilities</option>
          </select>
        </div>

        <div className="form-group">
          <label>Priority *</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of your request"
            required
          />
        </div>

        <div className="form-group">
          <label>Your Full Name *</label>
          <input
            type="text"
            name="requesterName"
            value={formData.requesterName}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="form-group">
          <label>Your Email *</label>
          <input
            type="email"
            name="requesterEmail"
            value={formData.requesterEmail}
            onChange={handleChange}
            placeholder="your@university.edu"
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Request'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RequestForm;
