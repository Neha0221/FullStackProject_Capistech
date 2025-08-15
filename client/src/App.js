import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header/Header';
import Dashboard from './components/dashboard/Dashboard/Dashboard';
import TeamList from './components/teams/TeamList/TeamList';
import ProjectList from './components/projects/ProjectList/ProjectList';
import TaskList from './components/tasks/TaskList/TaskList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/teams" element={<TeamList />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/tasks" element={<TaskList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}



export default App;
