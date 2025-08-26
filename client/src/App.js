import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header/Header';
import Dashboard from './components/dashboard/Dashboard/Dashboard';
import MemberDashboard from './components/dashboard/Dashboard/MemberDashboard';
import TeamList from './components/teams/TeamList/TeamList';
import ProjectList from './components/projects/ProjectList/ProjectList';
import TaskList from './components/tasks/TaskList/TaskList';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RoleDashboard = () => {
  const { user } = useAuth();
  const role = user?.role;
  if (role === 'owner' || role === 'admin') {
    return <Dashboard />;
  }
  return <MemberDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
              <Route path="/teams" element={<ProtectedRoute><TeamList /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute><ProjectList /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
