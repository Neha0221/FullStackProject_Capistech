import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './Header.module.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

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
          {(user?.role === 'owner' || user?.role === 'admin') && (
            <Link to="/tasks" className={`${styles.navLink} ${isActive('/tasks')}`}>
              Tasks
            </Link>
          )}
          {!token ? (
            <>
              <Link to="/login" className={`${styles.navLink} ${isActive('/login')}`}>
                Login
              </Link>
              {/* <Link to="/register" className={`${styles.navLink} ${isActive('/register')}`}>
                Register
              </Link> */}
            </>
          ) : (
            <>
              <span className={styles.navLink} style={{ opacity: 0.8 }}>
                {user?.name} ({user?.role})
              </span>
              <button className={styles.navLink} onClick={() => { logout(); navigate('/login'); }}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 