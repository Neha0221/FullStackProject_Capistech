import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/user/login', form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.title}>Login</h2>
      {error && <div className={styles.messageError}>{error}</div>}
      <form onSubmit={onSubmit}>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={onChange} required className={styles.inputFull} />
        </div>
        <div className={styles.formGroup}>
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={onChange} required className={styles.inputFull} />
        </div>
        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <div className={styles.footerLink}>
        No account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Login;


