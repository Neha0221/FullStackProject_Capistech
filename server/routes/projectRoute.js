const express = require('express');
const router = express.Router();
const { createProject, getProject, getProjectById, updateProject, deleteProject } = require('../controllers/projectController');
const { validateProject, validateProjectUpdate, validateObjectId } = require('../middleware/validation');
const { requireAuth, authorize } = require('../middleware/auth');

// Create project
router.post('/', requireAuth, authorize('owner','admin'), validateProject, createProject);

// Get all projects (with pagination and search)
router.get('/', getProject);

// Get single project
router.get('/:id', validateObjectId, getProjectById);

// Update project
router.put('/:id', requireAuth, authorize('owner','admin'), validateObjectId, validateProjectUpdate, updateProject);

// Delete project
router.delete('/:id', requireAuth, authorize('owner','admin'), validateObjectId, deleteProject);

module.exports = router;