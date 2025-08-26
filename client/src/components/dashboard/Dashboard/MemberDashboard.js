import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import Loading from '../../common/Loading/Loading';
import { teamAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import StatusPieChart from '../../common/Charts/StatusPieChart';

const MemberDashboard = () => {
  const { user } = useAuth();
  const [member, setMember] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        // Find team member by email from logged in user
        const listRes = await teamAPI.getAll({ search: user?.email, limit: 1 });
        const found = listRes.data?.data?.members?.[0] || null;
        if (!found) {
          setError('No matching team member profile found');
          setLoading(false);
          return;
        }
        setMember(found);
        const summaryRes = await teamAPI.getSummary(found._id);
        setSummary(summaryRes.data?.data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load member dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) init();
  }, [user?.email]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Dashboard</h1>
        <p>{member ? `${member.name} • ${member.designation}` : ''}</p>
      </div>

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      {summary && (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📋</div>
              <div className={styles.statContent}>
                <h3>{summary.projects}</h3>
                <p>My Projects</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statContent}>
                <h3>{summary.tasks}</h3>
                <p>My Tasks</p>
              </div>
            </div>
          </div>

          <div className={styles.sections}>
            <div className={styles.section}>
              <h2>My Task Status</h2>
              <StatusPieChart statuses={summary.statuses} />
            </div>

            <div className={styles.section}>
              <h2>Quick Actions</h2>
              <div className={styles.quickActions}>
                <Link to="/teams" className={styles.actionCard}>
                  <div className={styles.actionIcon}>👥</div>
                  <h3>View Teams</h3>
                  <p>Browse team members and their information</p>
                </Link>

                <Link to="/projects" className={styles.actionCard}>
                  <div className={styles.actionIcon}>📋</div>
                  <h3>View Projects</h3>
                  <p>See all projects and team assignments</p>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MemberDashboard;


