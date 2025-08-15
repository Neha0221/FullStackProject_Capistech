import React from 'react';
import styles from './TaskCard.module.css';

const TaskCard = ({ task, projects, teams, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'to-do':
        return '#6c757d';
      case 'in-progress':
        return '#ffc107';
      case 'done':
        return '#28a745';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'to-do':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProjectName = (projectOrId) => {
    const projectId = typeof projectOrId === 'object' && projectOrId !== null ? projectOrId._id : projectOrId;
    const project = projects.find(p => p._id === projectId);
    if (project) return project.name;
    if (projectOrId && typeof projectOrId === 'object' && projectOrId.name) return projectOrId.name;
    return 'Unknown Project';
  };

  const getMemberNames = (membersOrIds) => {
    if (!membersOrIds || membersOrIds.length === 0) return 'No members assigned';
    
    const memberNames = membersOrIds.map(m => {
      const memberId = typeof m === 'object' && m !== null ? m._id : m;
      const member = teams.find(t => t._id === memberId);
      if (member) return member.name;
      if (m && typeof m === 'object' && m.name) return m.name;
      return 'Unknown Member';
    });
    
    return memberNames.join(', ');
  };

  const isOverdue = () => {
    const deadline = new Date(task.deadline);
    const today = new Date();
    return deadline < today && task.status !== 'done' && task.status !== 'cancelled';
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <div 
          className={styles.status}
          style={{ backgroundColor: getStatusColor(task.status) }}
        >
          {getStatusText(task.status)}
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.description}>{task.description}</p>
        
        <div className={styles.details}>
          <div className={styles.detail}>
            <span className={styles.label}>Project:</span>
            <span className={styles.value}>{getProjectName(task.project)}</span>
          </div>
          
          <div className={styles.detail}>
            <span className={styles.label}>Deadline:</span>
            <span className={`${styles.value} ${isOverdue() ? styles.overdue : ''}`}>
              {formatDate(task.deadline)}
              {isOverdue() && <span className={styles.overdueBadge}>Overdue</span>}
            </span>
          </div>
          
          <div className={styles.detail}>
            <span className={styles.label}>Assigned To:</span>
            <span className={styles.value}>{getMemberNames(task.assignedMembers)}</span>
          </div>
          
          <div className={styles.detail}>
            <span className={styles.label}>Created:</span>
            <span className={styles.value}>{formatDate(task.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button 
          className={styles.editButton}
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        <button 
          className={styles.deleteButton}
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
