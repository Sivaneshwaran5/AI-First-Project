const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Strict Auth: Requires valid JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Token missing.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_sales_ai_jwt_key_2026_production_ready'
    );
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired.',
    });
  }
};

// Optional Auth: If token is provided, attach user; otherwise continue as guest/demo user
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_sales_ai_jwt_key_2026_production_ready'
      );
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      // Ignore token validation failure in optional mode
    }
  }

  next();
};

module.exports = { protect, optionalAuth };
