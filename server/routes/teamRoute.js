const express = require('express');
const router = express.Router();
const { createTeam, getTeam, getAllTeam, updateMember, deleteMember } = require('../controllers/teamController');
const { validateTeam, validateTeamUpdate, validateObjectId } = require('../middleware/validation');

// Create team member
router.post('/', validateTeam, createTeam);

// Get all team members (with pagination and search)
router.get('/', getAllTeam);

// Get single team member
router.get('/:id', validateObjectId, getTeam);

// Update team member
router.put('/:id', validateObjectId, validateTeamUpdate, updateMember);

// Delete team member
router.delete('/:id', validateObjectId, deleteMember);

module.exports = router;