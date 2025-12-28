# Smart Service Request Portal

> A modern, full-stack service request management application built with React, Node.js/Express, and SQLite.

## Overview

Smart Service Request Portal is a production-ready application for managing service requests in universities and enterprises. It provides a complete workflow for creating, tracking, and resolving requests with features like automatic SLA tracking, real-time analytics, team collaboration through comments, and a comprehensive audit trail.

**Key Capabilities:**
- Create and manage service requests (IT, Facilities, Admin, etc.)
- Automatic SLA deadline calculation based on priority levels
- Multi-user collaboration with request comments
- Complete request history and status change tracking
- Real-time analytics dashboard with key metrics
- Role-based access control (Admin and User roles)
- Smart filtering and search functionality
- Mobile-friendly responsive design

## Features

### Core Requirements ✅
- **Create Requests** - Intuitive form with title, category, description, priority, and requester information
- **View & Filter Requests** - List view with filters by category, status, and priority
- **Update Status** - Workflow: Open → In Progress → Resolved (admin only)
- **Authentication** - JWT-based secure login and registration system

### Innovative Features Beyond Requirements ✨

**1. Automatic SLA Tracking**
- Priority-based deadline calculation:
  - High Priority: 2-day deadline
  - Medium Priority: 5-day deadline
  - Low Priority: 7-day deadline
- Visual SLA breach indicators
- SLA compliance metrics in analytics

**2. Request Comments & Team Collaboration**
- Add comments to any request for team discussion
- Timestamps and user attribution on all comments
- Complete conversation history preserved

**3. Complete Request History**
- Audit trail of all status changes
- Track who made each change and when
- Sequential timeline view of request lifecycle

**4. Advanced Analytics Dashboard**
- Real-time statistics and metrics:
  - Total requests, status breakdown
  - Distribution by category and priority
  - Average resolution time
  - SLA compliance rate
  - Breach detection and monitoring
- Live updates as requests are created and updated

**5. Smart Multi-Criteria Filtering**
- Filter by category, status, and priority simultaneously
- Text search across request titles and descriptions
- Instant results with high performance

**6. Role-Based Access Control**
- **Admin Role** (`admin@university.edu`):
  - Can update request status
  - Access to all requests
  - Full analytics visibility
- **User Role** (`user@university.edu`):
  - Can create and view requests
  - Can add comments
  - Limited to viewing own and related requests

**7. Responsive Modern UI**
- Gradient design with professional appearance
- Mobile-friendly layout
- Smooth animations and transitions
- Intuitive navigation
- Accessible color scheme with status badges

**8. Performance Metrics Tracking**
- Resolution time calculation
- Completion rate analysis
- SLA breach tracking
- Request distribution insights

## Tech Stack

**Backend:**
- Node.js v14+
- Express.js (REST API framework)
- JWT (JSON Web Tokens) for authentication
- bcryptjs for password hashing
- uuid for unique request IDs
- SQLite (file-based database, default; `data.sqlite`)

**Frontend:**
- React 18
- Axios for HTTP requests
- React Router for navigation
- CSS Grid & Flexbox for responsive design
- No build tool required (works as-is)

**Database:**
- SQLite (file-based, `data.sqlite`) for local development
- Easily switch to MongoDB or PostgreSQL for production

## Quick Start

**Prerequisites:** Node.js v14+ and npm

## Project Structure

```
Smart Service Request Portal/
├── backend/
│   ├── package.json           # Dependencies & scripts
│   ├── server.js              # Main Express server with all routes
│   ├── models/
│   │   ├── Request.js         # Request data model
│   │   └── User.js            # User data model
│   └── utils/
│       └── reportGenerator.js # Analytics utilities
│
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html         # HTML entry point
│   └── src/
│       ├── App.js             # Main React component & routing
│       ├── App.css            # Global styles
│       ├── index.js           # React DOM render
│       ├── index.css          # Base styles
│       └── pages/
│           ├── Login.js       # Authentication page
│           ├── Dashboard.js   # Request list & filters
│           ├── RequestForm.js # Create new request
│           ├── RequestDetails.js # View & update request
│           └── Analytics.js   # Real-time statistics
│
├── data.sqlite                # Database (created on first run)
├── README.md                  # This file
└── package.json              # Root workspace config
```

## Configuration

### Backend Environment (`.env` file)

Create `backend/.env` (do not commit to version control):

```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

**Important:** Change `JWT_SECRET` in production to a secure random string.

### Frontend Environment (optional)

Create `frontend/.env` if backend runs on a different URL:

```env
REACT_APP_API_URL=http://localhost:5000
```

## API Endpoints

All endpoints require JWT authentication (except `/api/auth/login` and `/api/auth/register`).

### Authentication

**POST** `/api/auth/login`
```json
{
  "email": "admin@university.edu",
  "password": "admin123"
}
```
Returns: `{ token: "...", user: { id, email, name, role } }`

**POST** `/api/auth/register`
```json
{
  "email": "newuser@example.com",
  "password": "secure123",
  "name": "New User"
}
```
Returns: `{ token: "...", user: {...} }`

### Requests

**POST** `/api/requests` - Create new request
```json
{
  "title": "WiFi not working",
  "category": "IT",
  "description": "No internet connection in Lab A",
  "priority": "High",
  "requesterName": "John Doe",
  "requesterEmail": "john@example.com"
}
```

**GET** `/api/requests` - List all requests
- Query params: `?category=IT&status=Open&priority=High` (optional filters)

**GET** `/api/requests/:id` - Get request details

**PUT** `/api/requests/:id/status` - Update request status (Admin only)
```json
{
  "status": "In Progress"
}
```
Valid values: `"Open"`, `"In Progress"`, `"Resolved"`

**POST** `/api/requests/:id/comments` - Add comment
```json
{
  "comment": "Started investigation"
}
```

### Analytics

**GET** `/api/analytics/stats` - Get dashboard statistics

Returns:
```json
{
  "totalRequests": 10,
  "openRequests": 5,
  "inProgressRequests": 3,
  "resolvedRequests": 2,
  "byCategory": { "IT": 4, "Admin": 3, "Facilities": 3 },
  "byPriority": { "High": 2, "Medium": 5, "Low": 3 },
  "averageResolutionTime": 2.5,
  "slaBreach": 1
}
```

### Health Check

**GET** `/api/health` - Server status check

## Usage

### Creating a Request

1. Click "Create Request" in navigation
2. Fill in the form:
   - Title: Brief description
   - Category: IT, Facilities, Admin, etc.
   - Description: Detailed explanation
   - Priority: High, Medium, or Low
   - Your name and email
3. Click "Submit"
4. Request appears in dashboard with auto-calculated SLA deadline

### Viewing & Filtering Requests

1. Click "Dashboard" or home
2. View all requests in the list
3. Use filters on the right:
   - **Category:** Select from dropdown
   - **Status:** Open, In Progress, Resolved
   - **Priority:** High, Medium, Low
4. Apply filters - results update instantly
5. Click any request to see details

### Updating Status (Admin Only)

1. Open a request from dashboard
2. In the sidebar, select new status:
   - Open → In Progress → Resolved
3. Status changes immediately
4. Change is recorded in history with timestamp

### Adding Comments

1. Open any request
2. Scroll to "Comments" section
3. Type your comment
4. Click "Add Comment"
5. Comment appears with your name and timestamp

### Viewing Analytics

1. Click "Analytics" tab
2. View real-time statistics:
   - Request counts by status, category, priority
   - Average resolution time
   - SLA compliance metrics
   - Performance indicators

## Architecture

```
┌─────────────────────────────────────────────────────┐
│              React Frontend (Port 3000)              │
│  ┌──────────────┬──────────────┬──────────────────┐ │
│  │  Dashboard   │ Request Form │ Request Details  │ │
│  │  Analytics   │  Login Page  │   Comments       │ │
│  └──────────────┴──────────────┴──────────────────┘ │
│                        ↕ Axios                      │
└─────────────────────────────────────────────────────┘
                         ↕ REST API
┌─────────────────────────────────────────────────────┐
│        Express API Server (Port 5000)               │
│  ┌──────────────┬──────────────┬──────────────────┐ │
│  │  Auth Routes │ Request CRUD │  Analytics Logic │ │
│  │  Middleware  │  Validation  │  JWT Auth        │ │
│  └──────────────┴──────────────┴──────────────────┘ │
│                        ↕ SQLite                     │
└─────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────┐
│         SQLite Database (data.sqlite)               │
│  ┌──────────────┬──────────────┬──────────────────┐ │
│  │   Users      │   Requests   │   Comments       │ │
│  │  Credentials │  Status Info │  History Records │ │
│  └──────────────┴──────────────┴──────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Data Flow:**
1. User interacts with React UI
2. Frontend makes HTTP requests to Express API
3. API validates JWT token and processes request
4. Backend performs business logic (SLA calculation, filtering, etc.)
5. Data persisted to SQLite database
6. Response sent back to frontend
7. UI updates in real-time

## Deployment

### Local Development

Already covered in Quick Start section above.

### Docker Deployment

**Backend Dockerfile:**
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Build and run:**
```bash
docker build -t smart-service-backend .
docker run -p 5000:5000 smart-service-backend
```

### Production Deployment

**Recommended platforms:** Heroku, AWS, Azure, DigitalOcean, Railway, Render

**Before deploying:**

1. Change JWT_SECRET to a secure random value
2. Update REACT_APP_API_URL to production API URL
3. Switch database to MongoDB or PostgreSQL (optional):
   - Install appropriate driver: `npm install mongoose` or `npm install pg`
   - Update database connection code in server.js
4. Enable HTTPS on your domain
5. Add environment variables via platform dashboard
6. Deploy backend, then frontend

**Example: Deploying to Heroku**

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET="your-secure-secret"
heroku config:set PORT=5000

# Deploy
git push heroku main
```

## Troubleshooting

### Backend won't start

**Error:** `Error: listen EADDRINUSE :::5000`
- **Solution:** Port 5000 is in use. Either:
  - Kill the process: `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)
  - Or change PORT in `.env` to an available port (e.g., 5001)

**Error:** `Module not found`
- **Solution:** Run `npm install` in the backend directory

### Frontend won't start

**Error:** `Port 3000 already in use`
- **Solution:** Kill the process using port 3000 or change port:
  ```bash
  PORT=3001 npm start
  ```

**Error:** `Module not found: Can't resolve 'axios'`
- **Solution:** Run `npm install` in the frontend directory

### Can't login

- Verify backend is running on port 5000
- Check email/password match demo credentials or registered user
- Check browser console (F12) for error messages
- Ensure CORS is enabled (it is by default)

### API calls failing

**Error:** `Network Error: 404 Not Found`
- Verify backend is running
- Check that endpoint path is correct
- Verify JWT token is being sent in headers

**Error:** `401 Unauthorized`
- Token may have expired (valid for 24 hours)
- Re-login to get a new token
- Verify token is being sent in `Authorization: Bearer <token>` header

### Database issues

**Error:** `SQLITE_CANTOPEN`
- Verify write permissions in project directory
- Delete `data.sqlite` and restart backend to recreate

**Migration needed for production:**
- Backup current `data.sqlite`
- Install MongoDB or PostgreSQL
- Update connection code in `server.js`
- Restart backend

## Security

### Implemented Security Features

✅ JWT authentication with 24-hour expiration  
✅ Password hashing with bcryptjs (10 salt rounds)  
✅ Protected API routes (authentication middleware)  
✅ CORS configuration (configurable by origin)  
✅ Input validation on all endpoints  
✅ Error handling (no sensitive data in error messages)  
✅ Role-based access control (Admin vs User)  
✅ Environment variable protection (secrets not in code)  


## Development Tips

### Adding a New Feature

**Backend:**
```javascript
// Add route in server.js
app.post('/api/new-feature', authenticateToken, (req, res) => {
  // Implement logic
  res.json({ success: true });
});
```

**Frontend:**
```javascript
// Call in React component
const response = await API.post('/new-feature', data);
```

### Common Code Patterns

**Making API calls:**
```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Protected route example:**
```javascript
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

## Support

For questions or issues:
1. Check this README's Troubleshooting section
2. Review API endpoint documentation above
3. Check browser console (F12) for error messages
4. Verify all prerequisites are installed (Node.js v14+, npm)

---

**Built with React, Express, and SQLite. Ready for production.**

   - `POST /api/auth/login` — Login (returns token)
   - `POST /api/auth/register` — Register new user
   - `POST /api/requests` — Create request (auth required)
   - `GET /api/requests` — List requests (filters supported)
   - `GET /api/requests/:id` — Get request details
   - `PUT /api/requests/:id/status` — Update status (admin)
   - `POST /api/requests/:id/comments` — Add a comment
   - `GET /api/analytics/stats` — Analytics stats

   ## Features Summary

   - Required: request creation, list & filters, status updates, JWT auth
   - Innovations: automatic SLA calculation, request comments, full history, real-time analytics, smart filtering, role-based access, responsive UI

   ## Sample Data

   On first run, demo users and sample requests are available:
   - admin@university.edu / admin123 (admin)
   - user@university.edu / admin123 (user)

   ## Security

   - JWT authentication with 24h token expiration
   - Password hashing with `bcryptjs`
   - Role-based access controls enforced in backend
   - Keep `JWT_SECRET` secure and do not commit `.env`
 # Smart Service Request Portal

A single-file consolidated README that contains all essential information to run, understand, and submit the Smart Service Request Portal. The repository uses SQLite for local persistence (file: `data.sqlite`).

## Overview

Smart Service Request Portal is a production-ready, full-stack application for managing service requests (IT, Facilities, Admin) with features including automatic SLA tracking, request comments, full history, role-based access, and a real-time analytics dashboard.



## Key Files

- `backend/server.js` — Express API server
- `backend/package.json` — backend dependencies & scripts
- `frontend/src/` — React app and pages
- `frontend/package.json` — frontend dependencies
- `data.sqlite` — SQLite DB (created on first run)

## Database (SQLite)

The project uses SQLite by default for local persistence. Data is stored in `data.sqlite` in the project root (created by the backend on first run). To use another database in production, replace the storage layer and install the appropriate client (e.g., `mongoose` for MongoDB or `pg` for PostgreSQL).

## Environment (examples)

Create `backend/.env` (do not commit secrets):

```
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

Create `frontend/.env` if needed:

```
REACT_APP_API_URL=http://localhost:5000
```

## API Endpoints (quick reference)

- `POST /api/auth/login` — Login (returns token)
- `POST /api/auth/register` — Register new user
- `POST /api/requests` — Create request (auth required)
- `GET /api/requests` — List requests (filters supported)
- `GET /api/requests/:id` — Get request details
- `PUT /api/requests/:id/status` — Update status (admin)
- `POST /api/requests/:id/comments` — Add a comment
- `GET /api/analytics/stats` — Analytics stats

## Features Summary

- Required: request creation, list & filters, status updates, JWT auth
- Innovations: automatic SLA calculation, request comments, full history, real-time analytics, smart filtering, role-based access, responsive UI

## Sample Data

On first run, demo users and sample requests are available:
- admin@university.edu / admin123 (admin)
- user@university.edu / admin123 (user)

## Security

- JWT authentication with 24h token expiration
- Password hashing with `bcryptjs`
- Role-based access controls enforced in backend
- Keep `JWT_SECRET` secure and do not commit `.env`


## Contact

For support or questions, open an issue in the repository or contact at 9839pranjal@gmail.com.


