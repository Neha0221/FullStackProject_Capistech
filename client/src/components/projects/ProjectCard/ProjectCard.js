import React from 'react';
import styles from './ProjectCard.module.css';
import { useAuth } from '../../../context/AuthContext';

const ProjectCard = ({ project, teams, onEdit, onDelete }) => {
  const { user } = useAuth();
  
  const handleEdit = () => {
    onEdit(project);
  };

  const handleDelete = () => {
    onDelete(project._id);
  };

  const getTeamMemberNames = () => {
    if (!project.teamMember || project.teamMember.length === 0) {
      return 'No team members assigned';
    }

    const memberNames = project.teamMember.map(member => {
      const teamMember = teams.find(team => team._id === member._id || team._id === member);
      return teamMember ? teamMember.name : 'Unknown Member';
    });

    return memberNames.join(', ');
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon}>
          📁
        </div>
        {/* Only show edit/delete actions for admin/owner users */}
        {(user?.role === 'owner' || user?.role === 'admin') && (
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
        )}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.name}>{project.name}</h3>
        <p className={styles.description}>{project.description}</p>
        
        <div className={styles.teamSection}>
          <h4 className={styles.teamTitle}>Team Members:</h4>
          <div className={styles.teamMembers}>
            {project.teamMember && project.teamMember.length > 0 ? (
              <div className={styles.memberList}>
                {project.teamMember.map((member, index) => {
                  const teamMember = teams.find(team => team._id === member._id || team._id === member);
                  return (
                    <div key={index} className={styles.member}>
                      <span className={styles.memberAvatar}>
                        {teamMember ? teamMember.name.charAt(0).toUpperCase() : '?'}
                      </span>
                      <span className={styles.memberName}>
                        {teamMember ? teamMember.name : 'Unknown Member'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={styles.noMembers}>No team members assigned</p>
            )}
          </div>
        </div>
      </div>
      
      <div className={styles.footer}>
        <small className={styles.date}>
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </small>
        <div className={styles.stats}>
          <span className={styles.memberCount}>
            {project.teamMember ? project.teamMember.length : 0} members
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 