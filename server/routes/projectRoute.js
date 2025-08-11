const express = require('express');
const router = express.Router();
const { createProject, getProject, getProjectById, updateProject, deleteProject } = require('../controllers/projectController');
const { validateProject, validateProjectUpdate, validateObjectId } = require('../middleware/validation');

// Create project
router.post('/', validateProject, createProject);

// Get all projects (with pagination and search)
router.get('/', getProject);

// Get single project
router.get('/:id', validateObjectId, getProjectById);

// Update project
router.put('/:id', validateObjectId, validateProjectUpdate, updateProject);

// Delete project
router.delete('/:id', validateObjectId, deleteProject);

module.exports = router;