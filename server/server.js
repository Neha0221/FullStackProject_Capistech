const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoute');
const teamRoute = require('./routes/teamRoute');
const projectRoute = require('./routes/projectRoute');
const taskRoute = require('./routes/taskRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/user', userRoute);
app.use('/api/teams', teamRoute);
app.use('/api/projects', projectRoute);
app.use('/api/tasks', taskRoute);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Simple 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});