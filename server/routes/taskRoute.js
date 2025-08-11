const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const { validateTask, validateTaskUpdate, validateObjectId } = require('../middleware/validation');

// Create task
router.post('/', validateTask, createTask);

// Get all tasks (with filtering, pagination and search)
router.get('/', getTasks);

// Get single task
router.get('/:id', validateObjectId, getTaskById);

// Update task
router.put('/:id', validateObjectId, validateTaskUpdate, updateTask);

// Delete task
router.delete('/:id', validateObjectId, deleteTask);

module.exports = router;
