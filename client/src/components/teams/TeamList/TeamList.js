import React, { useState, useEffect } from 'react';
import { teamAPI } from '../../../services/api';
import TeamCard from '../TeamCard/TeamCard';
import TeamForm from '../TeamForm/TeamForm';
import Loading from '../../common/Loading/Loading';
import styles from './TeamList.module.css';
import { useAuth } from '../../../context/AuthContext';

const TeamList = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);

  const fetchTeams = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 3,
        ...(search && { search })
      };
      
      console.log('Fetching teams with params:', params);
      const response = await teamAPI.getAll(params);
      const { data } = response.data;
      
      console.log('Teams API response:', data);
      console.log('Total members:', data.totalMembers);
      console.log('Total pages:', data.totalPages);
      console.log('Current page:', data.page);
      
      setTeams(data.members);
      setTotalPages(data.totalPages);
      setTotalMembers(data.totalMembers);
      setCurrentPage(data.page);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError(err.response?.data?.message || 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTeams(1, searchTerm);
  };

  const handlePageChange = (page) => {
    fetchTeams(page, searchTerm);
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await teamAPI.delete(id);
        fetchTeams(currentPage, searchTerm);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete team member');
      }
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingTeam(null);
    fetchTeams(currentPage, searchTerm);
  };

  if (loading && teams.length === 0) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Team Members</h2>
        {(user?.role === 'owner' || user?.role === 'admin') && (
          <button 
            className={styles.addButton}
            onClick={() => setShowForm(true)}
          >
            Add Team Member
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
            placeholder="Search team members..."
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
            <p>Total Members: {totalMembers}</p>
          </div>

          {teams.length === 0 ? (
            <div className={styles.empty}>
              <p>No team members found.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {teams.map((team) => (
                <TeamCard
                  key={team._id}
                  team={team}
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
        <TeamForm
          team={editingTeam}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTeam(null);
          }}
        />
      )}
    </div>
  );
};

export default TeamList; 