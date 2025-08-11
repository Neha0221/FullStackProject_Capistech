const Joi = require('joi');

// Team validation schema
const teamSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 50 characters',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    designation: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Designation must be at least 2 characters long',
        'string.max': 'Designation cannot exceed 50 characters',
        'any.required': 'Designation is required'
    })
});

// Project validation schema
const projectSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Project name must be at least 2 characters long',
        'string.max': 'Project name cannot exceed 100 characters',
        'any.required': 'Project name is required'
    }),
    description: Joi.string().min(10).max(500).required().messages({
        'string.min': 'Description must be at least 10 characters long',
        'string.max': 'Description cannot exceed 500 characters',
        'any.required': 'Description is required'
    }),
    teamMember: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).min(1).required().messages({
        'array.min': 'At least one team member is required',
        'any.required': 'Team members are required',
        'string.pattern.base': 'Invalid team member ID format'
    })
});

// Task validation schema
const taskSchema = Joi.object({
    title: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Task title must be at least 2 characters long',
        'string.max': 'Task title cannot exceed 100 characters',
        'any.required': 'Task title is required'
    }),
    description: Joi.string().min(10).max(500).required().messages({
        'string.min': 'Description must be at least 10 characters long',
        'string.max': 'Description cannot exceed 500 characters',
        'any.required': 'Description is required'
    }),
    deadline: Joi.date().greater('now').required().messages({
        'date.greater': 'Deadline must be a future date',
        'any.required': 'Deadline is required'
    }),
    project: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'Invalid project ID format',
        'any.required': 'Project is required'
    }),
    assignedMembers: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).min(1).required().messages({
        'array.min': 'At least one team member must be assigned',
        'any.required': 'Assigned members are required',
        'string.pattern.base': 'Invalid team member ID format'
    }),
    status: Joi.string().valid('to-do', 'in-progress', 'done', 'cancelled').default('to-do').messages({
        'any.only': 'Status must be one of: to-do, in-progress, done, cancelled'
    })
});

// Update schemas (all fields optional)
const teamUpdateSchema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    email: Joi.string().email().optional(),
    designation: Joi.string().min(2).max(50).optional()
});

const projectUpdateSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().min(10).max(500).optional(),
    teamMember: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).min(1).optional()
});

const taskUpdateSchema = Joi.object({
    title: Joi.string().min(2).max(100).optional(),
    description: Joi.string().min(10).max(500).optional(),
    deadline: Joi.date().greater('now').optional(),
    project: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
    assignedMembers: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).min(1).optional(),
    status: Joi.string().valid('to-do', 'in-progress', 'done', 'cancelled').optional()
});

// Validation middleware functions
const validateTeam = (req, res, next) => {
    const { error } = teamSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.details.map(detail => detail.message)
        });
    }
    next();
};

const validateProject = (req, res, next) => {
    const { error } = projectSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.details.map(detail => detail.message)
        });
    }
    next();
};

const validateTask = (req, res, next) => {
    const { error } = taskSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.details.map(detail => detail.message)
        });
    }
    next();
};

const validateTeamUpdate = (req, res, next) => {
    const { error } = teamUpdateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.details.map(detail => detail.message)
        });
    }
    next();
};

const validateProjectUpdate = (req, res, next) => {
    const { error } = projectUpdateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.details.map(detail => detail.message)
        });
    }
    next();
};

const validateTaskUpdate = (req, res, next) => {
    const { error } = taskUpdateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.details.map(detail => detail.message)
        });
    }
    next();
};

// ObjectId validation middleware
const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }
    next();
};

module.exports = {
    validateTeam,
    validateProject,
    validateTask,
    validateTeamUpdate,
    validateProjectUpdate,
    validateTaskUpdate,
    validateObjectId
}; 