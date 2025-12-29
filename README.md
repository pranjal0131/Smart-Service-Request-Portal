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

JWT authentication with 24-hour expiration  
Password hashing with bcryptjs (10 salt rounds)  
Protected API routes (authentication middleware)  
CORS configuration (configurable by origin)  
Input validation on all endpoints  
Error handling (no sensitive data in error messages)  
Role-based access control (Admin vs User)  
Environment variable protection (secrets not in code)  


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


