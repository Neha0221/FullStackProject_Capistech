const Project = require('../model/projectModel');
const Team = require('../model/Team');

// Create Project
const createProject = async (req, res) => {
    try {
        const { name, description, teamMember } = req.body;

        // Check if project already exists
        const existingProject = await Project.findOne({ name });
        if (existingProject) {
            return res.status(400).json({
                success: false,
                message: 'Project with this name already exists'
            });
        }

        // Validate that all team members exist
        const teamMembersExist = await Team.find({ _id: { $in: teamMember } });
        if (teamMembersExist.length !== teamMember.length) {
            return res.status(400).json({
                success: false,
                message: 'One or more team members do not exist'
            });
        }

        const project = await Project.create({ name, description, teamMember });
        
        // Populate team member details for response
        await project.populate('teamMember', 'name email designation');

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Get Single Project
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('teamMember', 'name email designation');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Get All Projects with Pagination
const getProject = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build search filter
        const filter = {};
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Fetch projects with pagination and populate team details
        const projects = await Project.find(filter)
            .populate('teamMember', 'name email designation')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Count total for pagination info
        const totalProjects = await Project.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                page,
                limit,
                totalProjects,
                totalPages: Math.ceil(totalProjects / limit),
                projects
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Update Project
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if project exists
        const existingProject = await Project.findById(id);
        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // If name is being updated, check for duplicates
        if (updateData.name && updateData.name !== existingProject.name) {
            const duplicateProject = await Project.findOne({ 
                name: updateData.name, 
                _id: { $ne: id } 
            });
            if (duplicateProject) {
                return res.status(400).json({
                    success: false,
                    message: 'Project with this name already exists'
                });
            }
        }

        // If team members are being updated, validate they exist
        if (updateData.teamMember) {
            const teamMembersExist = await Team.find({ _id: { $in: updateData.teamMember } });
            if (teamMembersExist.length !== updateData.teamMember.length) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more team members do not exist'
                });
            }
        }

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('teamMember', 'name email designation');

        res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            data: updatedProject
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Delete Project
const deleteProject = async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

module.exports = { createProject, getProject, getProjectById, updateProject, deleteProject };

