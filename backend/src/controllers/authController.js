const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'super_secret_sales_ai_jwt_key_2026_production_ready',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc Register a new user
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, organization } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Sales Rep',
      organization: organization || 'Apex Enterprise Solutions',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        organization: user.organization,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login user
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        organization: user.organization,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current logged in user
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        organization: user.organization,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Quick Demo Login for instant zero-friction exploration
// @route POST /api/auth/demo-login
const quickDemoLogin = async (req, res, next) => {
  try {
    const role = req.body.role || 'Sales Rep';
    const email = role === 'Sales Manager' ? 'elena@salesai.com' : 'alex@salesai.com';

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: role === 'Sales Manager' ? 'Elena Rostova' : 'Alex Carter',
        email,
        password: 'password123',
        role,
        avatar: role === 'Sales Manager'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        organization: 'Apex Intelligence Corp',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: `Logged in as Demo ${role}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        organization: user.organization,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, quickDemoLogin };
