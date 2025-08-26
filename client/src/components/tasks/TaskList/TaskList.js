import React, { useState, useEffect } from 'react';
import { taskAPI, projectAPI, teamAPI } from '../../../services/api';
import TaskCard from '../TaskCard/TaskCard';
import TaskForm from '../TaskForm/TaskForm';
import Loading from '../../common/Loading/Loading';
import styles from './TaskList.module.css';
import { useAuth } from '../../../context/AuthContext';

const TaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    project: '',
    member: ''
  });

  const fetchTasks = async (page = 1, search = '', filterParams = {}) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 3,
        ...(search && { search }),
        ...(filterParams.status && { status: filterParams.status }),
        ...(filterParams.project && { project: filterParams.project }),
        ...(filterParams.member && { member: filterParams.member })
      };
      
      console.log('Fetching tasks with params:', params);
      const response = await taskAPI.getAll(params);
      const { data } = response.data;
      
      console.log('Tasks API response:', data);
      console.log('Total tasks:', data.totalTasks);
      console.log('Total pages:', data.totalPages);
      console.log('Current page:', data.page);
      
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
      setTotalTasks(data.totalTasks);
      setCurrentPage(data.page);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll({ limit: 100 });
      setProjects(response.data.data.projects);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll({ limit: 100 });
      setTeams(response.data.data.members);
    } catch (err) {
      console.error('Failed to fetch teams:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchTeams();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTasks(1, searchTerm, filters);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    fetchTasks(1, searchTerm, newFilters);
  };

  const handlePageChange = (page) => {
    fetchTasks(page, searchTerm, filters);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.delete(id);
        fetchTasks(currentPage, searchTerm, filters);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingTask(null);
    fetchTasks(currentPage, searchTerm, filters);
  };

  const clearFilters = () => {
    setFilters({ status: '', project: '', member: '' });
    setSearchTerm('');
    fetchTasks(1, '', {});
  };

  if (loading && tasks.length === 0) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Tasks</h2>
        {(user?.role === 'owner' || user?.role === 'admin') && (
          <button 
            className={styles.addButton}
            onClick={() => setShowForm(true)}
          >
            Add Task
          </button>
        )}
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.searchSection}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Status:</label>
          <select 
            value={filters.status} 
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Status</option>
            <option value="to-do">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Project:</label>
          <select 
            value={filters.project} 
            onChange={(e) => handleFilterChange('project', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Member:</label>
          <select 
            value={filters.member} 
            onChange={(e) => handleFilterChange('member', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Members</option>
            {teams.map(member => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <button onClick={clearFilters} className={styles.clearButton}>
          Clear Filters
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className={styles.stats}>
            <p>Total Tasks: {totalTasks}</p>
          </div>

          {tasks.length === 0 ? (
            <div className={styles.empty}>
              <p>No tasks found.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  projects={projects}
                  teams={teams}
                  onEdit={(t) => (user?.role === 'owner' || user?.role === 'admin') && handleEdit(t)}
                  onDelete={(id) => (user?.role === 'owner' || user?.role === 'admin') && handleDelete(id)}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className={styles.pagination}>
              {console.log('Rendering pagination - totalPages:', totalPages, 'currentPage:', currentPage)}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                Previous
              </button>
              
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showForm && (
        <TaskForm
          task={editingTask}
          projects={projects}
          teams={teams}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default TaskList;
