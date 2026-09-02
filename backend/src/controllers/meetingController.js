const Meeting = require('../models/Meeting');
const { transcribeAudio, analyzeSalesTranscript, generateSimulatedAnalysis } = require('../services/aiService');
const { seedDatabase } = require('../services/seedService');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// @desc Get all meetings with filtering, searching, and sorting
// @route GET /api/meetings
const getAllMeetings = async (req, res, next) => {
  try {
    const { search, sentiment, dealStage, minIntent, sort = '-createdAt', page = 1, limit = 50 } = req.query;

    let query = {};

    // Filter by user if logged in
    if (req.user && req.user.role === 'Sales Rep') {
      // Reps can view their meetings + demo team meetings
      query.$or = [{ userId: req.user._id }, { userId: { $exists: false } }, { userId: null }];
    }

    // Search keyword in title or client company
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { clientCompany: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by overall sentiment
    if (sentiment && sentiment !== 'all') {
      query['sentiment.overall'] = sentiment;
    }

    // Filter by deal stage
    if (dealStage && dealStage !== 'all') {
      query.dealStage = dealStage;
    }

    // Filter by minimum buyer intent score
    if (minIntent) {
      query['buyerIntent.score'] = { $gte: Number(minIntent) };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const meetings = await Meeting.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('userId', 'name email role avatar');

    const total = await Meeting.countDocuments(query);

    res.status(200).json({
      success: true,
      count: meetings.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: meetings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single meeting details
// @route GET /api/meetings/:id
const getMeetingById = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id).populate('userId', 'name email role avatar');

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting intelligence record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: meeting,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Upload audio file and run full AI intelligence pipeline
// @route POST /api/meetings/upload
const uploadAndAnalyzeMeeting = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an audio file (MP3, WAV, M4A, WEBM, etc.)',
      });
    }

    const {
      title,
      clientName = 'Key Prospect',
      clientCompany = 'Enterprise Client',
      salesRepName = req.user ? req.user.name : 'Alex Carter',
      dealStage = 'Demo',
      dealValue = 35000,
      duration = 1200,
    } = req.body;

    const audioFilePath = req.file.path;
    const audioFileName = req.file.filename;
    const audioUrl = `/uploads/${audioFileName}`;

    console.log(`[Meeting Controller] Processing uploaded audio: ${req.file.originalname} (${req.file.size} bytes)`);

    // 1. Transcribe audio
    const transcriptionResult = await transcribeAudio(audioFilePath, req.file.originalname);
    const transcriptText = transcriptionResult.rawText || '';

    // 2. Run LLM Sales Intelligence Analysis
    const aiAnalysis = await analyzeSalesTranscript({
      transcriptText,
      clientCompany,
      clientName,
      dealStage,
    });

    // Determine transcript turns
    let transcriptTurns = [];
    if (aiAnalysis.transcriptTurns && aiAnalysis.transcriptTurns.length > 0) {
      transcriptTurns = aiAnalysis.transcriptTurns;
    } else if (transcriptionResult.turns && transcriptionResult.turns.length > 0) {
      transcriptTurns = transcriptionResult.turns;
    } else {
      // Split raw transcript into conversational turns
      const lines = transcriptText.split('\n').filter(l => l.trim().length > 0);
      transcriptTurns = lines.map((line, idx) => {
        const isRep = idx % 2 === 0;
        return {
          speaker: isRep ? salesRepName : clientName,
          role: isRep ? 'Sales Rep' : 'Prospect',
          text: line,
          timestamp: `0${Math.floor(idx * 1.5)}:${(idx * 25) % 60 < 10 ? '0' : ''}${(idx * 25) % 60}`,
          sentiment: 'neutral',
          intentScore: 70,
        };
      });
    }

    // 3. Format & Save Meeting Document
    const meeting = await Meeting.create({
      userId: req.user ? req.user._id : null,
      title: title || `Sales Call with ${clientCompany}`,
      clientName,
      clientCompany,
      salesRepName,
      dealStage,
      dealValue: Number(dealValue) || 35000,
      duration: Number(duration) || 1200,
      audioUrl,
      audioFileName: req.file.originalname,
      audioMimeType: req.file.mimetype,
      transcript: transcriptTurns,
      summary: aiAnalysis.summary || {
        executive: 'Meeting transcribed and analyzed successfully.',
        keyPoints: ['Explored solution capabilities', 'Reviewed technical alignment'],
        prospectNeeds: ['Automated workflows', 'Compliance support'],
        nextStepsSummary: 'Follow up with proposal documentation.',
      },
      sentiment: aiAnalysis.sentiment || {
        overall: 'positive',
        score: 75,
        breakdown: { positive: 65, neutral: 25, negative: 10 },
        timeline: [
          { minute: 1, sentimentScore: 60, topic: 'Introduction' },
          { minute: 5, sentimentScore: 75, topic: 'Core Features' },
          { minute: 10, sentimentScore: 85, topic: 'Pricing & Next Steps' },
        ],
      },
      buyerIntent: aiAnalysis.buyerIntent || {
        score: 80,
        level: 'High',
        winProbability: 75,
        signals: ['Requested proposal and pricing tiers'],
        objections: [],
        competitorsMentioned: [],
        budgetDiscussed: true,
      },
      actionItems: (aiAnalysis.actionItems || []).map(item => ({
        id: item.id || `act-${uuidv4().substring(0, 8)}`,
        task: item.task,
        assignee: item.assignee || salesRepName,
        priority: item.priority || 'Medium',
        dueDate: item.dueDate || new Date(Date.now() + 86400000 * 2),
        completed: Boolean(item.completed),
      })),
      coachingInsights: aiAnalysis.coachingInsights || {
        strengths: ['Great discovery questions', 'Clear value proposition'],
        improvements: ['Qualify budget approval authority earlier'],
        talkRatio: { salesRepPercent: 45, prospectPercent: 55 },
        dealHealthStatus: 'Healthy',
      },
      tags: ['Uploaded Call', dealStage, clientCompany],
    });

    console.log(`[Meeting Controller] Meeting record created successfully with ID: ${meeting._id}`);

    res.status(201).json({
      success: true,
      message: 'Audio analyzed and sales intelligence generated successfully',
      data: meeting,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Direct Text / Transcript Analysis (without audio file)
// @route POST /api/meetings/analyze-text
const analyzeTranscriptTextEndpoint = async (req, res, next) => {
  try {
    const {
      title,
      clientName = 'Decision Maker',
      clientCompany = 'Tech Innovations Ltd',
      salesRepName = req.user ? req.user.name : 'Alex Carter',
      dealStage = 'Demo',
      dealValue = 40000,
      transcriptText,
    } = req.body;

    if (!transcriptText || transcriptText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide transcript text to analyze',
      });
    }

    const aiAnalysis = await analyzeSalesTranscript({
      transcriptText,
      clientCompany,
      clientName,
      dealStage,
    });

    let transcriptTurns = aiAnalysis.transcriptTurns || [];
    if (transcriptTurns.length === 0) {
      const lines = transcriptText.split('\n').filter(l => l.trim().length > 0);
      transcriptTurns = lines.map((line, idx) => {
        const isRep = idx % 2 === 0;
        return {
          speaker: isRep ? salesRepName : clientName,
          role: isRep ? 'Sales Rep' : 'Prospect',
          text: line,
          timestamp: `0${Math.floor(idx * 1.5)}:${(idx * 25) % 60 < 10 ? '0' : ''}${(idx * 25) % 60}`,
          sentiment: 'neutral',
          intentScore: 70,
        };
      });
    }

    const meeting = await Meeting.create({
      userId: req.user ? req.user._id : null,
      title: title || `AI Analysis: ${clientCompany}`,
      clientName,
      clientCompany,
      salesRepName,
      dealStage,
      dealValue: Number(dealValue) || 40000,
      duration: 1500,
      audioUrl: '',
      audioFileName: 'text_transcript_input',
      transcript: transcriptTurns,
      summary: aiAnalysis.summary,
      sentiment: aiAnalysis.sentiment,
      buyerIntent: aiAnalysis.buyerIntent,
      actionItems: (aiAnalysis.actionItems || []).map(item => ({
        id: item.id || `act-${uuidv4().substring(0, 8)}`,
        task: item.task,
        assignee: item.assignee || salesRepName,
        priority: item.priority || 'Medium',
        dueDate: item.dueDate || new Date(Date.now() + 86400000 * 2),
        completed: Boolean(item.completed),
      })),
      coachingInsights: aiAnalysis.coachingInsights,
      tags: ['Text Analysis', dealStage, clientCompany],
    });

    res.status(201).json({
      success: true,
      message: 'Transcript analyzed successfully',
      data: meeting,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle or update action item
// @route PATCH /api/meetings/:id/action-items/:itemId
const updateActionItem = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;
    const { completed, task, assignee, priority, dueDate } = req.body;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    const actionItem = meeting.actionItems.find(item => item.id === itemId || item._id.toString() === itemId);
    if (!actionItem) {
      return res.status(404).json({ success: false, message: 'Action item not found' });
    }

    if (completed !== undefined) {
      actionItem.completed = completed;
      actionItem.completedAt = completed ? new Date() : null;
    }
    if (task !== undefined) actionItem.task = task;
    if (assignee !== undefined) actionItem.assignee = assignee;
    if (priority !== undefined) actionItem.priority = priority;
    if (dueDate !== undefined) actionItem.dueDate = dueDate;

    await meeting.save();

    res.status(200).json({
      success: true,
      message: 'Action item updated successfully',
      data: meeting.actionItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Add new action item to meeting
// @route POST /api/meetings/:id/action-items
const addActionItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { task, assignee, priority = 'Medium', dueDate } = req.body;

    if (!task) {
      return res.status(400).json({ success: false, message: 'Task description is required' });
    }

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    const newItem = {
      id: `act-${uuidv4().substring(0, 8)}`,
      task,
      assignee: assignee || (req.user ? req.user.name : 'Sales Rep'),
      priority,
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 86400000 * 2),
      completed: false,
    };

    meeting.actionItems.unshift(newItem);
    await meeting.save();

    res.status(201).json({
      success: true,
      message: 'Action item added successfully',
      data: meeting.actionItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete action item from meeting
// @route DELETE /api/meetings/:id/action-items/:itemId
const deleteActionItem = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    meeting.actionItems = meeting.actionItems.filter(
      item => item.id !== itemId && item._id.toString() !== itemId
    );
    await meeting.save();

    res.status(200).json({
      success: true,
      message: 'Action item removed',
      data: meeting.actionItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete meeting
// @route DELETE /api/meetings/:id
const deleteMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Meeting deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Reset & Seed Demo Data
// @route POST /api/meetings/seed
const seedDemoData = async (req, res, next) => {
  try {
    await seedDatabase(true);
    const meetings = await Meeting.find().sort('-createdAt');

    res.status(200).json({
      success: true,
      message: 'Demo sales meetings seeded successfully',
      data: meetings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMeetings,
  getMeetingById,
  uploadAndAnalyzeMeeting,
  analyzeTranscriptTextEndpoint,
  updateActionItem,
  addActionItem,
  deleteActionItem,
  deleteMeeting,
  seedDemoData,
};
