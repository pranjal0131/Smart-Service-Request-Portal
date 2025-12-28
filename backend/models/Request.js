

module.exports = {
  tableName: 'requests',
  columns: {
    id: 'TEXT PRIMARY KEY',
    title: 'TEXT NOT NULL',
    category: 'TEXT NOT NULL',
    description: 'TEXT NOT NULL',
    priority: 'TEXT NOT NULL',
    status: "TEXT DEFAULT 'Open'",
    requesterName: 'TEXT NOT NULL',
    requesterEmail: 'TEXT NOT NULL',
    createdAt: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
    updatedAt: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
    slaDeadline: 'DATETIME',
    assignedTo: 'TEXT',
    comments: "TEXT DEFAULT '[]'",
    history: "TEXT DEFAULT '[]'"
  },
  indexes: [
    'CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status)',
    'CREATE INDEX IF NOT EXISTS idx_requests_category ON requests(category)',
    'CREATE INDEX IF NOT EXISTS idx_requests_priority ON requests(priority)',
    'CREATE INDEX IF NOT EXISTS idx_requests_createdAt ON requests(createdAt)'
  ]
};
