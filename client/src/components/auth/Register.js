import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import styles from './Auth.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/user/register', form);
      setSuccess('Registered successfully. You can now log in.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      setError(err.response?.data || err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.title}>Register</h2>
      {error && <div className={styles.messageError}>{error}</div>}
      {success && <div className={styles.messageSuccess}>{success}</div>}
      <form onSubmit={onSubmit}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input name="name" value={form.name} onChange={onChange} required className={styles.inputFull} />
        </div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={onChange} required className={styles.inputFull} />
        </div>
        <div className={styles.formGroup}>
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={onChange} required className={styles.inputFull} />
        </div>
        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Creating...' : 'Register'}
        </button>
      </form>
      <div className={styles.footerLink}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Register;


