const express = require('express');
const router = express.Router();
const { createTeam, getTeam, getAllTeam, updateMember, deleteMember, getMemberSummary } = require('../controllers/teamController');
const { validateTeam, validateTeamUpdate, validateObjectId } = require('../middleware/validation');
const { requireAuth, authorize } = require('../middleware/auth');

// Create team member
router.post('/', requireAuth, authorize('owner','admin'), validateTeam, createTeam);

// Get all team members (with pagination and search)
router.get('/', getAllTeam);

// Get single team member
router.get('/:id', validateObjectId, getTeam);

// Get team member summary (projects/tasks/statuses)
router.get('/:id/summary', validateObjectId, getMemberSummary);

// Update team member
router.put('/:id', requireAuth, authorize('owner','admin'), validateObjectId, validateTeamUpdate, updateMember);

// Delete team member
router.delete('/:id', requireAuth, authorize('owner','admin'), validateObjectId, deleteMember);

module.exports = router;