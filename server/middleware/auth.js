const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

// Verify JWT and attach user to request
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.id).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

// Authorize roles (one of)
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        if (allowedRoles.length === 0 || allowedRoles.includes(req.user.role)) {
            return next();
        }
        return res.status(403).json({ success: false, message: 'Forbidden' });
    };
};

module.exports = { requireAuth, authorize };


