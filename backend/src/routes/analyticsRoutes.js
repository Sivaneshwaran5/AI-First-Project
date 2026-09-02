const express = require('express');
const router = express.Router();
const { getDashboardAnalytics } = require('../controllers/analyticsController');
const { optionalAuth } = require('../middleware/auth');

router.get('/dashboard', optionalAuth, getDashboardAnalytics);

module.exports = router;
