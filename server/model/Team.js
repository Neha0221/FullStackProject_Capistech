const { default: mongoose } = require("mongoose");

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long'],
            maxlength: [50, 'Name cannot exceed 50 characters']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
        },
        designation: {
            type: String,
            required: [true, 'Designation is required'],
            trim: true,
            minlength: [2, 'Designation must be at least 2 characters long'],
            maxlength: [50, 'Designation cannot exceed 50 characters']
        }
    },
    {
        timestamps: true
    }
);

// Create index for name field for search functionality (removed duplicate email index)
teamSchema.index({ name: 1 });

module.exports = mongoose.model('Team', teamSchema);