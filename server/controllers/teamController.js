const Team = require('../model/Team');

// Create Team Member
const createTeam = async (req, res) => {
    try {
        const { name, email, designation } = req.body;

        // Check if team member already exists
        const teamMemberExist = await Team.findOne({ email });
        if (teamMemberExist) {
            return res.status(400).json({
                success: false,
                message: 'Team member with this email already exists'
            });
        }

        const teamMember = await Team.create({
            name,
            email,
            designation
        });

        res.status(201).json({
            success: true,
            message: 'Team member created successfully',
            data: teamMember
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Get Single Team Member
const getTeam = async (req, res) => {
    try {
        const member = await Team.findById(req.params.id);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
        }
        res.status(200).json({
            success: true,
            data: member
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Get All Team Members with Pagination
const getAllTeam = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build search filter
        const filter = {};
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
                { designation: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const teams = await Team.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalMembers = await Team.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                page,
                limit,
                totalMembers,
                totalPages: Math.ceil(totalMembers / limit),
                members: teams
            }
        });
        
        console.log('Team pagination response:', {
            page,
            limit,
            totalMembers,
            totalPages: Math.ceil(totalMembers / limit),
            teamsCount: teams.length
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Update Team Member
const updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if email is being updated and if it already exists
        if (updateData.email) {
            const existingMember = await Team.findOne({ 
                email: updateData.email, 
                _id: { $ne: id } 
            });
            if (existingMember) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists with another team member'
                });
            }
        }

        const updatedMember = await Team.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedMember) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Team member updated successfully',
            data: updatedMember
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Delete Team Member
const deleteMember = async (req, res) => {
    try {
        const deletedMember = await Team.findByIdAndDelete(req.params.id);
        if (!deletedMember) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Team member deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

module.exports = { createTeam, getTeam, getAllTeam, updateMember, deleteMember };