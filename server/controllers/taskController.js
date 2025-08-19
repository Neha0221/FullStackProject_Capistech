const Task = require("../model/taskModel");
const Project = require("../model/projectModel");
const Team = require("../model/Team");

// Create Task
const createTask = async (req, res) => {
    try {
        const { title, description, deadline, project, assignedMembers, status } = req.body;

        // Validate that project exists
        const projectExists = await Project.findById(project);
        if (!projectExists) {
            return res.status(400).json({
                success: false,
                message: 'Project does not exist'
            });
        }

        // Validate that all assigned members exist
        const membersExist = await Team.find({ _id: { $in: assignedMembers } });
        if (membersExist.length !== assignedMembers.length) {
            return res.status(400).json({
                success: false,
                message: 'One or more assigned members do not exist'
            });
        }

        const task = await Task.create({ 
            title, 
            description, 
            deadline, 
            project, 
            assignedMembers, 
            status: status || 'to-do' 
        });

        // Populate project and member details for response
        await task.populate('project', 'name description');
        await task.populate('assignedMembers', 'name email designation');

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Get Single Task
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('project', 'name description')
            .populate('assignedMembers', 'name email designation');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Get Tasks with Filtering + Pagination
const getTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        // Filtering
        if (req.query.project) filter.project = req.query.project;
        if (req.query.member) filter.assignedMembers = req.query.member;
        if (req.query.status) filter.status = req.query.status;
        
        // Search filter
        if (req.query.search) {
            filter.$or = [
                { title: { $regex: req.query.search, $options: "i" } },
                { description: { $regex: req.query.search, $options: "i" } }
            ];
        }
        
        // Date range filter
        if (req.query.startDate && req.query.endDate) {
            filter.deadline = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        } else if (req.query.startDate) {
            filter.deadline = { $gte: new Date(req.query.startDate) };
        } else if (req.query.endDate) {
            filter.deadline = { $lte: new Date(req.query.endDate) };
        }

        const tasks = await Task.find(filter)
            .populate("project", "name description")
            .populate("assignedMembers", "name email designation")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalTasks = await Task.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                page,
                limit,
                totalTasks,
                totalPages: Math.ceil(totalTasks / limit),
                tasks
            }
        });
        
        console.log('Task pagination response:', {
            page,
            limit,
            totalTasks,
            totalPages: Math.ceil(totalTasks / limit),
            tasksCount: tasks.length
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Update Task
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if task exists
        const existingTask = await Task.findById(id);
        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Validate project if being updated
        if (updateData.project) {
            const projectExists = await Project.findById(updateData.project);
            if (!projectExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Project does not exist'
                });
            }
        }

        // Validate assigned members if being updated
        if (updateData.assignedMembers) {
            const membersExist = await Team.find({ _id: { $in: updateData.assignedMembers } });
            if (membersExist.length !== updateData.assignedMembers.length) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more assigned members do not exist'
                });
            }
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        )
        .populate('project', 'name description')
        .populate('assignedMembers', 'name email designation');

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTask
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Delete Task
const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
