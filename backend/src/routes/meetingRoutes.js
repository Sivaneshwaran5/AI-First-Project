const express = require('express');
const router = express.Router();
const {
  getAllMeetings,
  getMeetingById,
  uploadAndAnalyzeMeeting,
  analyzeTranscriptTextEndpoint,
  updateActionItem,
  addActionItem,
  deleteActionItem,
  deleteMeeting,
  seedDemoData,
} = require('../controllers/meetingController');
const upload = require('../middleware/upload');
const { optionalAuth, protect } = require('../middleware/auth');

// Public / Optional Auth routes for seamless demo operation
router.get('/', optionalAuth, getAllMeetings);
router.post('/upload', optionalAuth, upload.single('audio'), uploadAndAnalyzeMeeting);
router.post('/analyze-text', optionalAuth, analyzeTranscriptTextEndpoint);
router.post('/seed', seedDemoData);

// Single meeting item & sub-resources
router.get('/:id', optionalAuth, getMeetingById);
router.delete('/:id', optionalAuth, deleteMeeting);

// Action Items endpoints
router.post('/:id/action-items', optionalAuth, addActionItem);
router.patch('/:id/action-items/:itemId', optionalAuth, updateActionItem);
router.delete('/:id/action-items/:itemId', optionalAuth, deleteActionItem);

module.exports = router;
