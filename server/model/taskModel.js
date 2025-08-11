const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { 
        type: String, 
        required: [true, 'Task title is required'],
        trim: true,
        minlength: [2, 'Task title must be at least 2 characters long'],
        maxlength: [100, 'Task title cannot exceed 100 characters']
    },
    description: { 
        type: String, 
        required: [true, 'Task description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    deadline: { 
        type: Date, 
        required: [true, 'Deadline is required'],
        validate: {
            validator: function(v) {
                return v > new Date();
            },
            message: 'Deadline must be a future date'
        }
    },

    // Reference to Project collection
    project: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Project", 
        required: [true, 'Project is required']
    },

    // Array of Team member IDs
    assignedMembers: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Team", 
        required: [true, 'At least one team member must be assigned']
      }
    ],

    // Enum for task status
    status: {
      type: String,
      enum: {
        values: ["to-do", "in-progress", "done", "cancelled"],
        message: 'Status must be one of: to-do, in-progress, done, cancelled'
      },
      default: "to-do"
    }
  },
  { timestamps: true }
);

// Create indexes for better query performance
taskSchema.index({ project: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ deadline: 1 });
taskSchema.index({ assignedMembers: 1 });

// Create text index for search functionality
taskSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model("Task", taskSchema);
