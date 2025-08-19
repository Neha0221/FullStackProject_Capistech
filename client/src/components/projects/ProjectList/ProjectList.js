import React, { useState, useEffect } from 'react';
import { projectAPI, teamAPI } from '../../../services/api';
import ProjectCard from '../ProjectCard/ProjectCard';
import ProjectForm from '../ProjectForm/ProjectForm';
import Loading from '../../common/Loading/Loading';
import styles from './ProjectList.module.css';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);

  const fetchProjects = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 5,
        ...(search && { search })
      };
      
      const response = await projectAPI.getAll(params);
      const { data } = response.data;
      
      setProjects(data.projects);
      setTotalPages(data.totalPages);
      setTotalProjects(data.totalProjects);
      setCurrentPage(data.page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
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
    fetchProjects();
    fetchTeams();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects(1, searchTerm);
  };

  const handlePageChange = (page) => {
    fetchProjects(page, searchTerm);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.delete(id);
        fetchProjects(currentPage, searchTerm);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingProject(null);
    fetchProjects(currentPage, searchTerm);
  };

  if (loading && projects.length === 0) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Projects</h2>
        <button 
          className={styles.addButton}
          onClick={() => setShowForm(true)}
        >
          Add Project
        </button>
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
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className={styles.stats}>
            <p>Total Projects: {totalProjects}</p>
          </div>

          {projects.length === 0 ? (
            <div className={styles.empty}>
              <p>No projects found.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  teams={teams}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className={styles.pagination}>
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
        <ProjectForm
          project={editingProject}
          teams={teams}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectList; 