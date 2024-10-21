const jwt = require('jsonwebtoken');

// Middleware to verify token and check user role
const verifyToken = (requiredRole) => {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
      return res.status(401).json({ message: 'Access Denied: No token provided.' });
    }

    try {
       
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret from environment variables // Log the decoded token

      // Check if the user's role matches the required role
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: 'Access Denied: You do not have the correct role.' });
      }

      req.user = decoded; // Optionally, store the decoded user information in the request object
      next(); // User is authenticated and authorized
    } catch (error) {
      console.error('Token verification error:'); // Log the error for debugging
      return res.status(400).json({ message: 'Invalid token.' });
    }
  };
};

module.exports = verifyToken;
