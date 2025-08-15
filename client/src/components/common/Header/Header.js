import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? styles.active : '';
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>Task Manager</h1>
        </div>
        <nav className={styles.nav}>
          <Link to="/" className={`${styles.navLink} ${isActive('/')}`}>
            Dashboard
          </Link>
          <Link to="/teams" className={`${styles.navLink} ${isActive('/teams')}`}>
            Teams
          </Link>
          <Link to="/projects" className={`${styles.navLink} ${isActive('/projects')}`}>
            Projects
          </Link>
          <Link to="/tasks" className={`${styles.navLink} ${isActive('/tasks')}`}>
            Tasks
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 