import React, { useState } from 'react';
import { API } from '../App';

function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@university.edu');
  const [password, setPassword] = useState('admin123');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const data = isRegistering
        ? { email, password, name }
        : { email, password };

      const response = await API.post(endpoint, data);
      onLogin(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .login-box {
          background: white;
          padding: 3rem;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 400px;
        }

        .login-box h2 {
          text-align: center;
          color: #333;
          margin-bottom: 2rem;
          font-size: 1.8rem;
        }

        .login-box .form-group {
          margin-bottom: 1.5rem;
        }

        .login-box input {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .login-box input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .login-box button {
          width: 100%;
          padding: 0.8rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .login-box button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .login-box button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-msg {
          background: #ffe0e0;
          color: #d63031;
          padding: 0.8rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .toggle-auth {
          text-align: center;
          margin-top: 1.5rem;
          color: #666;
        }

        .toggle-auth a {
          color: #667eea;
          cursor: pointer;
          text-decoration: underline;
        }

        .demo-creds {
          background: #e7f5ff;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.85rem;
          color: #1971c2;
          margin-bottom: 1.5rem;
        }
      `}</style>

      <div className="login-box">
        <h2>{isRegistering ? 'Create Account' : 'Smart Service Portal'}</h2>

        <div className="demo-creds">
          📌 Demo: admin@university.edu / admin123
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required={isRegistering}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@university.edu"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="toggle-auth">
          {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
          <a onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Login' : 'Register'}
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
