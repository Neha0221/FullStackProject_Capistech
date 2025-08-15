import React, { useState, useEffect } from 'react';
import { projectAPI } from '../../../services/api';
import styles from './ProjectForm.module.css';

const ProjectForm = ({ project, teams, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teamMember: []
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        teamMember: project.teamMember ? project.teamMember.map(member => 
          typeof member === 'object' ? member._id : member
        ) : []
      });
    }
  }, [project]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Project name must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.teamMember.length === 0) {
      newErrors.teamMember = 'At least one team member is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTeamMemberChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      teamMember: selectedOptions
    }));
    
    if (errors.teamMember) {
      setErrors(prev => ({
        ...prev,
        teamMember: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (project) {
        await projectAPI.update(project._id, formData);
      } else {
        await projectAPI.create(formData);
      }
      onSubmit();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save project';
      if (err.response?.data?.errors) {
        const apiErrors = {};
        err.response.data.errors.forEach(error => {
          if (error.includes('name')) apiErrors.name = error;
          else if (error.includes('description')) apiErrors.description = error;
          else if (error.includes('team member')) apiErrors.teamMember = error;
        });
        setErrors(apiErrors);
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{project ? 'Edit Project' : 'Add Project'}</h3>
          <button onClick={onCancel} className={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.general && (
            <div className={styles.error}>
              {errors.general}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="name">Project Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.inputError : styles.input}
              placeholder="Enter project name"
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? styles.textareaError : styles.textarea}
              placeholder="Enter project description"
              rows="4"
            />
            {errors.description && <span className={styles.errorText}>{errors.description}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="teamMember">Team Members</label>
            <select
              id="teamMember"
              name="teamMember"
              multiple
              value={formData.teamMember}
              onChange={handleTeamMemberChange}
              className={errors.teamMember ? styles.selectError : styles.select}
              size="4"
            >
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name} - {team.designation}
                </option>
              ))}
            </select>
            <small className={styles.helpText}>
              Hold Ctrl (or Cmd on Mac) to select multiple team members
            </small>
            {errors.teamMember && <span className={styles.errorText}>{errors.teamMember}</span>}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Saving...' : (project ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm; 