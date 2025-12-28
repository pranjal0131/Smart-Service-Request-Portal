
module.exports = {
  tableName: 'users',
  columns: {
    id: 'TEXT PRIMARY KEY',
    email: 'TEXT UNIQUE NOT NULL',
    password: 'TEXT NOT NULL',
    name: 'TEXT NOT NULL',
    role: "TEXT DEFAULT 'user'",
    createdAt: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
  }
};
