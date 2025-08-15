import React from 'react';
import styles from './TeamCard.module.css';

const TeamCard = ({ team, onEdit, onDelete }) => {
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
        <div className={styles.actions}>
          <button 
            onClick={handleEdit}
            className={styles.editButton}
            title="Edit"
          >
            ✏️
          </button>
          <button 
            onClick={handleDelete}
            className={styles.deleteButton}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.name}>{team.name}</h3>
        <p className={styles.email}>{team.email}</p>
        <div className={styles.designation}>
          <span className={styles.badge}>{team.designation}</span>
        </div>
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