import React, { useState, useEffect } from 'react';
import { taskAPI } from '../../../services/api';
import styles from './TaskForm.module.css';

const TaskForm = ({ task, projects, teams, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    project: '',
    assignedMembers: [],
    status: 'to-do'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
        project: task.project || '',
        assignedMembers: task.assignedMembers || [],
        status: task.status || 'to-do'
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 2) {
      newErrors.title = 'Title must be at least 2 characters long';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate <= today) {
        newErrors.deadline = 'Deadline must be a future date';
      }
    }

    if (!formData.project) {
      newErrors.project = 'Project is required';
    }

    if (!formData.assignedMembers.length) {
      newErrors.assignedMembers = 'At least one team member must be assigned';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleMemberChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      assignedMembers: checked
        ? [...prev.assignedMembers, value]
        : prev.assignedMembers.filter(id => id !== value)
    }));
    
    // Clear error when user selects/deselects members
    if (errors.assignedMembers) {
      setErrors(prev => ({
        ...prev,
        assignedMembers: ''
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
      const taskData = {
        ...formData,
        deadline: new Date(formData.deadline).toISOString()
      };

      if (task) {
        await taskAPI.update(task._id, taskData);
      } else {
        await taskAPI.create(taskData);
      }
      
      onSubmit();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save task';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button 
            className={styles.closeButton}
            onClick={onCancel}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.submit && (
            <div className={styles.error}>
              {errors.submit}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={errors.title ? styles.inputError : styles.input}
              placeholder="Enter task title"
            />
            {errors.title && <span className={styles.errorText}>{errors.title}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={errors.description ? styles.inputError : styles.input}
              placeholder="Enter task description"
              rows="4"
            />
            {errors.description && <span className={styles.errorText}>{errors.description}</span>}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="deadline">Deadline *</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className={errors.deadline ? styles.inputError : styles.input}
              />
              {errors.deadline && <span className={styles.errorText}>{errors.deadline}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={styles.input}
              >
                <option value="to-do">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="project">Project *</label>
            <select
              id="project"
              name="project"
              value={formData.project}
              onChange={handleInputChange}
              className={errors.project ? styles.inputError : styles.input}
            >
              <option value="">Select a project</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.project && <span className={styles.errorText}>{errors.project}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Assigned Members *</label>
            <div className={styles.memberGrid}>
              {teams.map(member => (
                <label key={member._id} className={styles.memberCheckbox}>
                  <input
                    type="checkbox"
                    value={member._id}
                    checked={formData.assignedMembers.includes(member._id)}
                    onChange={handleMemberChange}
                  />
                  <span className={styles.memberName}>{member.name}</span>
                </label>
              ))}
            </div>
            {errors.assignedMembers && <span className={styles.errorText}>{errors.assignedMembers}</span>}
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
              {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
