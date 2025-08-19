import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI, teamAPI, taskAPI } from '../../../services/api';
import Loading from '../../common/Loading/Loading';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    teams: 0,
    tasks: 0,
    tasksByStatus: {
      'to-do': 0,
      'in-progress': 0,
      'done': 0,
      'cancelled': 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all data to get counts
      const [projectsRes, teamsRes, tasksRes] = await Promise.all([
        projectAPI.getAll({ limit: 1000 }),
        teamAPI.getAll({ limit: 1000 }),
        taskAPI.getAll({ limit: 1000 })
      ]);

      const projects = projectsRes.data.data.projects;
      const teams = teamsRes.data.data.members;
      const tasks = tasksRes.data.data.tasks;

      // Calculate task status counts
      const tasksByStatus = {
        'to-do': 0,
        'in-progress': 0,
        'done': 0,
        'cancelled': 0
      };

      tasks.forEach(task => {
        if (tasksByStatus.hasOwnProperty(task.status)) {
          tasksByStatus[task.status]++;
        }
      });

      setStats({
        projects: projects.length,
        teams: teams.length,
        tasks: tasks.length,
        tasksByStatus
      });
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p>Welcome to your Task Management System</p>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <h3>{stats.projects}</h3>
            <p>Total Projects</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>{stats.teams}</h3>
            <p>Team Members</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <h3>{stats.tasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
      </div>

      <div className={styles.sections}>
        <div className={styles.section}>
          <h2>Task Status Overview</h2>
          <div className={styles.taskStats}>
            <div className={styles.taskStat}>
              <span className={styles.taskLabel}>To Do</span>
              <span className={styles.taskCount} style={{ color: '#6c757d' }}>
                {stats.tasksByStatus['to-do']}
              </span>
            </div>
            <div className={styles.taskStat}>
              <span className={styles.taskLabel}>In Progress</span>
              <span className={styles.taskCount} style={{ color: '#ffc107' }}>
                {stats.tasksByStatus['in-progress']}
              </span>
            </div>
            <div className={styles.taskStat}>
              <span className={styles.taskLabel}>Done</span>
              <span className={styles.taskCount} style={{ color: '#28a745' }}>
                {stats.tasksByStatus['done']}
              </span>
            </div>
            <div className={styles.taskStat}>
              <span className={styles.taskLabel}>Cancelled</span>
              <span className={styles.taskCount} style={{ color: '#dc3545' }}>
                {stats.tasksByStatus['cancelled']}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Quick Actions</h2>
          <div className={styles.quickActions}>

            <Link to="/teams" className={styles.actionCard}>
              <div className={styles.actionIcon}>👥</div>
              <h3>Manage Teams</h3>
              <p>Add and manage team members</p>
            </Link>

            <Link to="/projects" className={styles.actionCard}>
              <div className={styles.actionIcon}>📋</div>
              <h3>Manage Projects</h3>
              <p>Create and manage your projects</p>
            </Link>
            
            <Link to="/tasks" className={styles.actionCard}>
              <div className={styles.actionIcon}>✅</div>
              <h3>Manage Tasks</h3>
              <p>Create and track your tasks</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 