const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'smart-service-secret-key-2025';

// Initialize SQLite Database
const db = new Database('smart-service-portal.db');
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS requests (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT DEFAULT 'Open',
    requesterName TEXT NOT NULL,
    requesterEmail TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    slaDeadline DATETIME,
    assignedTo TEXT,
    comments TEXT DEFAULT '[]',
    history TEXT DEFAULT '[]'
  );
`);

// Middleware
app.use(cors());
app.use(express.json());

// Seed database if empty
async function seedDatabase() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password, name, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    insertUser.run(uuidv4(), 'admin@university.edu', hashedPassword, 'Admin User', 'admin');
    insertUser.run(uuidv4(), 'user@university.edu', hashedPassword, 'Student User', 'user');
    console.log('✓ Users seeded');
  }

  const requestCount = db.prepare('SELECT COUNT(*) as count FROM requests').get().count;
  if (requestCount === 0) {
    const insertRequest = db.prepare(`
      INSERT INTO requests (id, title, category, description, priority, status, requesterName, requesterEmail, slaDeadline, assignedTo, comments, history)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertRequest.run(
      '1', 'Laptop not connecting to WiFi', 'IT', 'Unable to connect to university WiFi network on my Dell laptop',
      'High', 'Open', 'John Doe', 'john@university.edu',
      new Date('2025-12-22').toISOString(), null, '[]', '[]'
    );

    insertRequest.run(
      '2', 'Room booking for seminar', 'Admin', 'Need to book conference room B for 50 participants on Dec 28',
      'Medium', 'In Progress', 'Jane Smith', 'jane@university.edu',
      new Date('2025-12-27').toISOString(), 'admin@university.edu', '[]',
      JSON.stringify([{ status: 'Open', changedAt: new Date('2025-12-18').toISOString(), changedBy: 'System' }])
    );

    insertRequest.run(
      '3', 'Air conditioning not working in Lab 204', 'Facilities', 'AC unit in lab 204 is making noise and not cooling effectively',
      'High', 'Resolved', 'Prof. Anderson', 'anderson@university.edu',
      new Date('2025-12-21').toISOString(), 'admin@university.edu', '[]',
      JSON.stringify([
        { status: 'Open', changedAt: new Date('2025-12-15').toISOString(), changedBy: 'System' },
        { status: 'In Progress', changedAt: new Date('2025-12-16').toISOString(), changedBy: 'admin@university.edu' },
        { status: 'Resolved', changedAt: new Date('2025-12-24').toISOString(), changedBy: 'admin@university.edu' }
      ])
    );
    console.log('✓ Requests seeded');
  }
}

seedDatabase().catch(err => console.error('Seeding error:', err));

// Add error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ========== AUTH ENDPOINTS ==========

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name required' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newId = uuidv4();
    
    db.prepare(`
      INSERT INTO users (id, email, password, name, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(newId, email, hashedPassword, name, 'user');

    const token = jwt.sign(
      { id: newId, email, name, role: 'user' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: { id: newId, email, name, role: 'user' }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ========== REQUEST ENDPOINTS ==========

// Create Request
app.post('/api/requests', authenticateToken, (req, res) => {
  try {
    const { title, category, description, priority, requesterName, requesterEmail } = req.body;
    console.log('POST /api/requests received:', { title, category, priority, requesterName });

    if (!title || !category || !description || !priority || !requesterName || !requesterEmail) {
      console.log('Missing fields error');
      return res.status(400).json({ error: 'All fields required' });
    }

    const id = uuidv4();
    const now = new Date();
    const slaDeadline = calculateSLADeadline(priority);

    db.prepare(`
      INSERT INTO requests (id, title, category, description, priority, status, requesterName, requesterEmail, createdAt, updatedAt, slaDeadline, history)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, title, category, description, priority, 'Open',
      requesterName, requesterEmail, now.toISOString(), now.toISOString(), slaDeadline.toISOString(),
      JSON.stringify([{ status: 'Open', changedAt: now.toISOString(), changedBy: req.user.email }])
    );

    const request = getRequestFormatted(id);
    console.log('Request created successfully:', request.id);
    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// Get all requests with filters
app.get('/api/requests', authenticateToken, (req, res) => {
  try {
    console.log('GET /api/requests called');
    const { category, status, priority, search } = req.query;
    let query = 'SELECT * FROM requests WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY CASE priority WHEN \'High\' THEN 0 WHEN \'Medium\' THEN 1 ELSE 2 END, createdAt DESC';

    console.log('Executing query:', query);
    const requests = db.prepare(query).all(...params);
    console.log('Requests fetched:', requests.length);
    res.json(requests.map(formatRequest));
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Get single request
app.get('/api/requests/:id', authenticateToken, (req, res) => {
  try {
    const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json(formatRequest(request));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch request' });
  }
});

// Update request status
app.put('/api/requests/:id/status', authenticateToken, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Open', 'In Progress', 'Resolved'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update request status' });
    }

    const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    const history = JSON.parse(request.history || '[]');
    history.push({
      status,
      changedAt: new Date().toISOString(),
      changedBy: req.user.email
    });

    db.prepare(`
      UPDATE requests SET status = ?, updatedAt = ?, assignedTo = ?, history = ?
      WHERE id = ?
    `).run(
      status, new Date().toISOString(), req.user.email, JSON.stringify(history), req.params.id
    );

    const updated = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id);
    res.json(formatRequest(updated));
  } catch (error) {
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// Add comment to request
app.post('/api/requests/:id/comments', authenticateToken, (req, res) => {
  try {
    const { comment } = req.body;
    const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id);

    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (!comment) return res.status(400).json({ error: 'Comment required' });

    const comments = JSON.parse(request.comments || '[]');
    comments.push({
      author: req.user.name,
      email: req.user.email,
      text: comment,
      createdAt: new Date().toISOString()
    });

    db.prepare('UPDATE requests SET comments = ? WHERE id = ?').run(
      JSON.stringify(comments), req.params.id
    );

    const updated = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id);
    res.status(201).json(formatRequest(updated));
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// List users (admin only)
app.get('/api/users', authenticateToken, (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can list users' });
    }
    const users = db.prepare('SELECT id, name, email, role FROM users').all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Assign request to a user (admin only)
app.put('/api/requests/:id/assign', authenticateToken, (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can assign requests' });
    }

    const { assigneeEmail } = req.body;
    if (!assigneeEmail) return res.status(400).json({ error: 'assigneeEmail required' });

    const assignee = db.prepare('SELECT id FROM users WHERE email = ?').get(assigneeEmail);
    if (!assignee) return res.status(400).json({ error: 'Assignee not found' });

    const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    const history = JSON.parse(request.history || '[]');
    history.push({
      status: request.status,
      changedAt: new Date().toISOString(),
      changedBy: req.user.email,
      note: `Assigned to ${assigneeEmail}`
    });

    db.prepare('UPDATE requests SET assignedTo = ?, updatedAt = ?, history = ? WHERE id = ?').run(
      assigneeEmail, new Date().toISOString(), JSON.stringify(history), req.params.id
    );

    const updated = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id);
    res.json(formatRequest(updated));
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign request' });
  }
});

// Get analytics/dashboard stats
app.get('/api/analytics/stats', authenticateToken, (req, res) => {
  try {
    const totalRequests = db.prepare('SELECT COUNT(*) as count FROM requests').get().count;
    const openRequests = db.prepare('SELECT COUNT(*) as count FROM requests WHERE status = \'Open\'').get().count;
    const inProgressRequests = db.prepare('SELECT COUNT(*) as count FROM requests WHERE status = \'In Progress\'').get().count;
    const resolvedRequests = db.prepare('SELECT COUNT(*) as count FROM requests WHERE status = \'Resolved\'').get().count;
    
    const stats = {
      totalRequests,
      openRequests,
      inProgressRequests,
      resolvedRequests,
      byCategory: {
        IT: db.prepare('SELECT COUNT(*) as count FROM requests WHERE category = \'IT\'').get().count,
        Admin: db.prepare('SELECT COUNT(*) as count FROM requests WHERE category = \'Admin\'').get().count,
        Facilities: db.prepare('SELECT COUNT(*) as count FROM requests WHERE category = \'Facilities\'').get().count
      },
      byPriority: {
        High: db.prepare('SELECT COUNT(*) as count FROM requests WHERE priority = \'High\'').get().count,
        Medium: db.prepare('SELECT COUNT(*) as count FROM requests WHERE priority = \'Medium\'').get().count,
        Low: db.prepare('SELECT COUNT(*) as count FROM requests WHERE priority = \'Low\'').get().count
      },
      averageResolutionTime: 0,
      slaBreach: db.prepare('SELECT COUNT(*) as count FROM requests WHERE status != \'Resolved\' AND slaDeadline < datetime(\'now\')').get().count
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ========== UTILITY FUNCTIONS ==========

function formatRequest(dbRequest) {
  return {
    id: dbRequest.id,
    title: dbRequest.title,
    category: dbRequest.category,
    description: dbRequest.description,
    priority: dbRequest.priority,
    status: dbRequest.status,
    requesterName: dbRequest.requesterName,
    requesterEmail: dbRequest.requesterEmail,
    createdAt: dbRequest.createdAt,
    updatedAt: dbRequest.updatedAt,
    slaDeadline: dbRequest.slaDeadline,
    assignedTo: dbRequest.assignedTo,
    comments: JSON.parse(dbRequest.comments || '[]'),
    history: JSON.parse(dbRequest.history || '[]')
  };
}

function getRequestFormatted(id) {
  const dbRequest = db.prepare('SELECT * FROM requests WHERE id = ?').get(id);
  return formatRequest(dbRequest);
}

function calculateSLADeadline(priority) {
  const now = new Date();
  const deadlineMap = {
    'High': 2,
    'Medium': 5,
    'Low': 7
  };

  const days = deadlineMap[priority] || 7;
  const deadline = new Date(now);
  deadline.setDate(deadline.getDate() + days);
  return deadline;
}

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Service Request Portal API',
    version: '1.0.0',
    database: 'SQLite',
    endpoints: {
      auth: '/api/auth/login, /api/auth/register',
      requests: '/api/requests',
      health: '/api/health'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', database: 'SQLite connected' });
});

app.listen(PORT, () => {
  console.log(`✓ Smart Service Portal API running on port ${PORT} (SQLite)`);
  console.log(`Available endpoints: http://localhost:${PORT}`);
});
