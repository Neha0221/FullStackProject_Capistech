const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const { validateTask, validateTaskUpdate, validateObjectId } = require('../middleware/validation');
const { requireAuth, authorize } = require('../middleware/auth');

// Create task
router.post('/', requireAuth, authorize('owner','admin'), validateTask, createTask);

// Get all tasks (with filtering, pagination and search)
router.get('/', getTasks);

// Get single task
router.get('/:id', validateObjectId, getTaskById);

// Update task
router.put('/:id', requireAuth, authorize('owner','admin'), validateObjectId, validateTaskUpdate, updateTask);

// Delete task
router.delete('/:id', requireAuth, authorize('owner','admin'), validateObjectId, deleteTask);

module.exports = router;
