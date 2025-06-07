const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized access, Please login first" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = {
            id: decoded.id,  
            email: decoded.email,
        };
        
        next();
        
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ 
                success: false,
                message: "Invalid token" 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ 
                success: false,
                message: "Token expired, please login again" 
            });
        }
        
        return res.status(500).json({ 
            success: false,
            message: "Authentication failed" 
        });
    }
};

module.exports = { authenticateToken };