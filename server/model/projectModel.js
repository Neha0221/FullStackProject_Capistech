const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Project name is required'],
        trim: true,
        minlength: [2, 'Project name must be at least 2 characters long'],
        maxlength: [100, 'Project name cannot exceed 100 characters'],
        unique: true
    },
    description: { 
        type: String, 
        required: [true, 'Project description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    teamMember: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Team", 
            required: [true, 'At least one team member is required']
        }
    ]
}, {
    timestamps: true
});

// Create index for description field for search functionality (removed duplicate name index)
projectSchema.index({ description: 'text' });

module.exports = mongoose.model('Project', projectSchema);
