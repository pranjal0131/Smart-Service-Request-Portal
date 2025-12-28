import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RequestForm from './pages/RequestForm';
import RequestDetails from './pages/RequestDetails';
import Analytics from './pages/Analytics';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const AuthContext = React.createContext();
export const ToastContext = React.createContext();
export const API = axios.create({ baseURL: API_URL });

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [toast, setToast] = useState(null);
  const [refreshDashboard, setRefreshDashboard] = useState(0);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete API.defaults.headers.common['Authorization'];
    setCurrentPage('dashboard');
  };

  const navigateTo = (page, requestId = null) => {
    setCurrentPage(page);
    if (requestId) setSelectedRequestId(requestId);
    if (page === 'dashboard') {
      setRefreshDashboard(prev => prev + 1);
    }
  };

  const showToast = (message, type = 'info', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <AuthContext.Provider value={{ user, onLogout: handleLogout }}>
      <ToastContext.Provider value={{ showToast }}>
        <div className="app">
          {toast && (
            <div className={`toast toast-${toast.type}`} role="status">
              {toast.message}
            </div>
          )}

          <nav className="navbar">
            <div className="navbar-brand">
              <h1>📋 Smart Service Portal</h1>
            </div>
            <div className="navbar-menu">
              <button
                className={currentPage === 'dashboard' ? 'active' : ''}
                onClick={() => navigateTo('dashboard')}
              >
                Dashboard
              </button>
              <button
                className={currentPage === 'create' ? 'active' : ''}
                onClick={() => navigateTo('create')}
              >
                New Request
              </button>
              <button
                className={currentPage === 'analytics' ? 'active' : ''}
                onClick={() => navigateTo('analytics')}
              >
                Analytics
              </button>
              <span className="user-info">{user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </nav>

          <main className="main-content">
            {currentPage === 'dashboard' && (
              <Dashboard key={refreshDashboard} onSelectRequest={(id) => navigateTo('details', id)} />
            )}
            {currentPage === 'create' && (
              <RequestForm onSuccess={() => navigateTo('dashboard')} />
            )}
            {currentPage === 'details' && (
              <RequestDetails requestId={selectedRequestId} onBack={() => navigateTo('dashboard')} />
            )}
            {currentPage === 'analytics' && <Analytics />}
          </main>
        </div>
      </ToastContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
