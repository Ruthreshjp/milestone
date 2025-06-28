const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Received token:', token);
    if (!token) throw new Error('No token provided');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;