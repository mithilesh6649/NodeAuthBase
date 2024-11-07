const jwt = require('jsonwebtoken');
const config = require('../config/config'); // assuming config contains JWT_SECRET_KEY
const helper = require('../utils/index');
// Middleware to verify the token
const verifyAccessToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        // Check if the Authorization header is present
        if (!authHeader) {
            let data = helper.failed(401, 'Authorization header is missing');
            return res.status(401).json(data);
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.split(' ')[1]; // [0] is 'Bearer', [1] is the token

        if (!token) {
            let data = helper.failed(401, 'Token is missing');
            return res.status(401).json(data);
        }

        // Verify the token using JWT secret
        const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

        // Store the decoded information in the request object (e.g., user)
        req.user = decoded;

        // Call the next middleware or route handler
        next();

    } catch (err) {
        console.log(err);
        // Handle errors (invalid token, expired token, etc.)
        let data = helper.failed(403, 'Invalid or expired token');
        return res.status(403).json(data);
    }
};


module.exports = verifyAccessToken;