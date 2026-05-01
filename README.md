# TaskFlow API

> A production-ready full-stack task management REST API with JWT authentication, role-based access control, and a React dashboard. Designed to demonstrate scalable backend architecture and secure API design.

---

## 🌟 Key Features Implemented

### ✅ Backend (Primary Focus)
- **User Authentication**: Secure registration and login using JWT and bcrypt password hashing.
- **Role-Based Access Control**: `user` vs `admin` roles, with specific endpoints restricted to admins (e.g., viewing all users).
- **CRUD Operations**: Complete RESTful API for managing tasks (Create, Read, Update, Delete).
- **API Versioning**: All routes are versioned under `/api/v1/`.
- **Validation & Error Handling**: Robust input validation using `express-validator` and centralized global error handling.
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation available at `/api/docs`.
- **Database**: MongoDB with Mongoose ODM, utilizing schemas and relationships.

### ✅ Basic Frontend (Supportive)
- **Framework**: Built with React.js (Vite).
- **Authentication Flow**: Login and registration pages storing JWT securely.
- **Protected Dashboard**: Access restricted to authenticated users.
- **Task Management**: Full UI to perform CRUD actions on tasks.
- **User Feedback**: Styled success and error alerts based on API responses.

### ✅ Security & Scalability
- **Secure Handling**: JWT token extraction and verification middleware.
- **Input Sanitization**: Trimming and validation of all incoming data to prevent injection.
- **Scalable Structure**: MVC architecture ready for new modules.
- **Deployment Ready**: Fully containerized with Docker and Docker Compose.

---

## 🛠 Tech Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Runtime    | Node.js 20                                              |
| Framework  | Express.js                                              |
| Database   | MongoDB 7 + Mongoose                                    |
| Auth       | JWT (jsonwebtoken) + bcryptjs (saltRounds=10)           |
| Validation | express-validator                                        |
| Security   | helmet, cors, morgan                                     |
| API Docs   | swagger-jsdoc + swagger-ui-express (`/api/docs`)        |
| Frontend   | React 18 (Vite) + React Router v6 + Axios              |
| Container  | Docker + Docker Compose                                  |

---

## Local Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (or use Docker Compose)
- npm

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd taskflow
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set your JWT_SECRET
npm run dev
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Open in browser
| Service      | URL                         |
|--------------|-----------------------------|
| Frontend     | http://localhost:5173        |
| Backend API  | http://localhost:5000        |
| Swagger Docs | http://localhost:5000/api/docs |

---

## Docker Setup

```bash
# Copy env and set JWT_SECRET
cp backend/.env.example backend/.env

# Start all services
docker-compose up --build
```

Services:
- MongoDB → `localhost:27017`
- Backend  → `localhost:5000`
- Frontend → `localhost:5173`

---

## API Endpoints

| Method | Route                     | Auth Required | Role  | Description                          |
|--------|---------------------------|:-------------:|:-----:|--------------------------------------|
| POST   | `/api/v1/auth/register`   | ❌            | Any   | Register new user, returns JWT       |
| POST   | `/api/v1/auth/login`      | ❌            | Any   | Login, returns JWT + user object     |
| GET    | `/api/v1/tasks`           | ✅            | Any   | Own tasks (admin gets all tasks)     |
| POST   | `/api/v1/tasks`           | ✅            | Any   | Create a task (owner = logged-in user) |
| GET    | `/api/v1/tasks/:id`       | ✅            | Any   | Get task by ID (owner or admin)      |
| PUT    | `/api/v1/tasks/:id`       | ✅            | Any   | Update task (owner or admin)         |
| DELETE | `/api/v1/tasks/:id`       | ✅            | Any   | Delete task (owner or admin)         |
| GET    | `/api/v1/admin/users`     | ✅            | Admin | List all users (no passwords)        |

All protected routes require the header:
```
Authorization: Bearer <token>
```

### Response Format

**Success:**
```json
{ "success": true, "data": { ... } }
```

**Error:**
```json
{ "success": false, "message": "Human-readable error" }
```

**Validation Error (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Please provide a valid email address." }]
}
```

---

## HTTP Status Codes

| Code | Meaning               |
|------|-----------------------|
| 200  | OK                    |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict (duplicate)  |
| 422  | Validation Error      |
| 500  | Internal Server Error |

---

## Scalability Notes

TaskFlow is architectured with horizontal scalability in mind. The **MVC pattern** (models, controllers, routes, validators) enforces clean separation of concerns, making it straightforward to split services independently. **JWT-based authentication is fully stateless** — no server-side sessions are stored, so multiple backend instances behind a load balancer (e.g., Nginx) can each verify tokens independently without shared state.

**MongoDB** supports horizontal scaling via native **sharding**, distributing documents across replica sets for both read and write scalability. For heavy read workloads like `GET /tasks`, a **Redis caching layer** (e.g., `ioredis`) can dramatically reduce database load by caching per-user task lists with short TTLs invalidated on write.

**Nginx** serves as a reverse proxy and load balancer, distributing traffic across multiple Node.js instances started with `pm2 cluster` mode. The entire stack is **Docker-containerized** with `docker-compose`, making it trivial to deploy to Kubernetes or cloud container services (AWS ECS, GCP Cloud Run).

**API versioning** via `/api/v1/` prefixes ensures breaking changes can be introduced in `/api/v2/` without affecting existing clients. Finally, **`express-rate-limit`** can be dropped in as middleware at the router level to throttle abusive clients, protecting the API from DDoS and brute-force attacks with zero architectural changes.

---

## Project Structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── middleware/auth.js
│   │   ├── middleware/role.js
│   │   ├── models/User.js
│   │   ├── models/Task.js
│   │   ├── controllers/auth.controller.js
│   │   ├── controllers/task.controller.js
│   │   ├── routes/v1/auth.routes.js
│   │   ├── routes/v1/task.routes.js
│   │   ├── routes/v1/admin.routes.js
│   │   ├── validators/auth.validator.js
│   │   ├── validators/task.validator.js
│   │   └── app.js
│   ├── server.js
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── context/AuthContext.jsx
│   │   ├── components/Navbar.jsx
│   │   ├── components/TaskCard.jsx
│   │   ├── components/TaskForm.jsx
│   │   ├── pages/Login.jsx
│   │   ├── pages/Register.jsx
│   │   ├── pages/Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .gitignore
└── README.md
```
