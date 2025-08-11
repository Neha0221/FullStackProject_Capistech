# Task Management Application (Full Stack)

A comprehensive task management application built with React frontend and Express.js backend, featuring team management, project management, and task management with advanced filtering and pagination capabilities.

---

## 📂 Project Structure

```
FullStackProject/
├── server/                 # Backend API
│   ├── config/
│   │   └── db.js          # Database configuration
│   ├── controllers/       # Request handlers
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   ├── teamController.js
│   │   └── userController.js
│   ├── model/            # Mongoose models
│   │   ├── projectModel.js
│   │   ├── taskModel.js
│   │   ├── Team.js
│   │   └── userModel.js
│   ├── routes/           # Express routes
│   │   ├── projectRoute.js
│   │   ├── taskRoute.js
│   │   ├── teamRoute.js
│   │   └── userRoute.js
│   ├── package.json
│   └── server.js         # Main entry point
└── client/               # Frontend (React) - Coming Soon
```

---

## 🚀 Features Implemented

### Backend Features ✅

- **Team Management**
  - Create, read, update, delete team members
  - Validation for name, email, and designation fields
  - RESTful API endpoints

- **Project Management**
  - Create, read, update, delete projects
  - Associate team members with projects
  - Validation for name, description, and team members

- **Task Management**
  - Create, read, update, delete tasks
  - Assign tasks to projects and team members
  - Status tracking (to-do, in-progress, done, cancelled)
  - Advanced filtering and pagination

- **Data Validation & Error Handling**
  - Input validation using Joi
  - Proper error responses
  - Data integrity checks

### Frontend Features 🚧 (In Development)

- **Team Management UI**
  - Add/edit team member forms
  - Team member list with pagination
  - Real-time validation

- **Project Management UI**
  - Project creation and editing forms
  - Project list with team member associations
  - Pagination support

- **Task Management UI**
  - Task creation and editing forms
  - Advanced filtering (by project, member, status, date range)
  - Pagination and search functionality

---

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Joi** - Data validation
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing

### Frontend (Coming Soon)
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Material-UI/Tailwind CSS** - UI components

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1️⃣ Clone the Repository
```bash
git clone <your-repo-url>
cd FullStackProject
```

### 2️⃣ Backend Setup
```bash
cd server
npm install
```

### 3️⃣ Environment Configuration
Create a `.env` file in the `server` directory:
```env
PORT=8000
MONGO_URI=mongodb+srv://neha:CjryPqGiw5sEn4lf@cluster0.mwiyepg.mongodb.net/Task-management-app?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### 4️⃣ Start the Backend Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:8000`

### 5️⃣ Frontend Setup (Coming Soon)
```bash
cd client
npm install
npm start
```

---

## 📡 API Endpoints

### Team Management
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create a new team
- `GET /api/teams/:id` - Get team by ID
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Project Management
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Task Management
- `GET /api/tasks` - Get all tasks (with filtering & pagination)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### User Management
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login

---

## 🔧 API Usage Examples

### Create a Team Member
```bash
curl -X POST http://localhost:8000/api/teams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "designation": "Developer"
  }'
```

### Create a Project
```bash
curl -X POST http://localhost:8000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "E-commerce Website",
    "description": "Build a modern e-commerce platform",
    "teamMembers": ["team-member-id-1", "team-member-id-2"]
  }'
```

### Create a Task with Filtering
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design Homepage",
    "description": "Create responsive homepage design",
    "deadline": "2024-02-15",
    "project": "project-id",
    "assignedMembers": ["member-id-1"],
    "status": "to-do"
  }'
```

### Filter Tasks
```bash
curl "http://localhost:8000/api/tasks?project=project-id&status=in-progress&page=1&limit=10"
```

---

## 🧪 Testing

### Using Postman
1. Import the API collection (if available)
2. Set the base URL to `http://localhost:8000`
3. Test all endpoints

### Using cURL
Examples are provided in the API Usage section above.

---

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 8000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/task-management |
| `JWT_SECRET` | JWT secret key | your-secret-key |
| `NODE_ENV` | Environment mode | development |

---

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Install dependencies: `npm install`
3. Start the server: `npm start`

### Frontend Deployment (Coming Soon)
1. Build the project: `npm run build`
2. Deploy the `build` folder to your hosting service

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

[Your Name] - Task Management Application

---

## 🔗 Links

- [GitHub Repository](your-repo-url)
- [API Documentation](your-api-docs-url)
- [Live Demo](your-demo-url)

---

## 📞 Support

For support and questions, please open an issue in the GitHub repository or contact [your-email@example.com].

