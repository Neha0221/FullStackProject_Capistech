import React, { useEffect, useState } from 'react';
import styles from './TeamCard.module.css';
import { teamAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

const TeamCard = ({ team, onEdit, onDelete }) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const { data } = await teamAPI.getSummary(team._id);
        setSummary(data.data);
      } catch (e) {
        setErr(e.response?.data?.message || 'Failed to load member summary');
      } finally {
        setLoading(false);
      }
    };
    // Only fetch summary for admin/owner users
    if (team?._id && (user?.role === 'owner' || user?.role === 'admin')) {
      fetchSummary();
    } else {
      setLoading(false);
    }
  }, [team?._id, user?.role]);
  const handleEdit = () => {
    onEdit(team);
  };

  const handleDelete = () => {
    onDelete(team._id);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {team.name.charAt(0).toUpperCase()}
        </div>
        {/* Only show edit/delete actions for admin/owner users */}
        {(user?.role === 'owner' || user?.role === 'admin') && (
          <div className={styles.actions}>
            <button 
              onClick={handleEdit}
              className={styles.editButton}
              title="Edit"
            >
              📝
            </button>
            <button 
              onClick={handleDelete}
              className={styles.deleteButton}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.name}>{team.name}</h3>
        <p className={styles.email}>{team.email}</p>
        <div className={styles.designation}>
          <span className={styles.badge}>{team.designation}</span>
        </div>
        {/* Only show metrics for admin/owner users */}
        {(user?.role === 'owner' || user?.role === 'admin') && (
          <div className={styles.metrics}>
            {loading ? (
              <small>Loading summary…</small>
            ) : err ? (
              <small className={styles.errorText}>{err}</small>
            ) : summary && (
              <div className={styles.summaryGrid}>
                <div className={styles.metricBox}>
                  <div className={styles.metricLabel}>Projects</div>
                  <div className={styles.metricValue}>{summary.projects}</div>
                </div>
                <div className={styles.metricBox}>
                  <div className={styles.metricLabel}>Tasks</div>
                  <div className={styles.metricValue}>{summary.tasks}</div>
              </div>
                <div className={styles.statusRow}>
                  <span>To‑Do:</span>
                  <strong>{summary.statuses['to-do']}</strong>
                </div>
                <div className={styles.statusRow}>
                  <span>In‑Progress:</span>
                  <strong>{summary.statuses['in-progress']}</strong>
                </div>
                <div className={styles.statusRow}>
                  <span>Done:</span>
                  <strong>{summary.statuses['done']}</strong>
                </div>
                <div className={styles.statusRow}>
                  <span>Cancelled:</span>
                  <strong>{summary.statuses['cancelled']}</strong>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className={styles.footer}>
        <small className={styles.date}>
          Added: {new Date(team.createdAt).toLocaleDateString()}
        </small>
      </div>
    </div>
  );
};

export default TeamCard; 